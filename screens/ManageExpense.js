import { useContext, useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import IconButton from '../components/UI/IconButton';
import ExpenseForm from '../components/ManageExpense/ExpenseForm';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import ErrorOverlay from '../components/UI/ErrorOverlay';

import { ExpensesContext } from '../store/expenses-context';
import { GlobalStyles } from '../constants/styles';
import { deleteExpenseRequest, storeExpense, updateExpenseRequest } from '../util/http';

export default function ManageExpense({ route, navigation }) {
	const { deleteExpense, addExpense, updateExpense, expenses } = useContext(ExpensesContext);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();

	const expenseId = route.params?.expenseId;
	const isEditing = !!expenseId;

	const selectedExpense = expenses.find((expense) => expense.id === expenseId);

	useLayoutEffect(() => {
		navigation.setOptions({
			title: isEditing ? 'Edit Expense' : 'Add Expense'
		});
	}, [navigation, isEditing]);

	async function deleteExpenseHandler() {
		setIsLoading(true);
		try {
			await deleteExpenseRequest(expenseId);
			deleteExpense(expenseId);
			navigation.goBack();
		} catch (err) {
			setIsLoading(false);
			setError(err.message);
		}
	};
	
	async function confirmHandler(expenseData) {
		setIsLoading(true);
		try {
			if (isEditing) {
				updateExpense(expenseId, expenseData);
				await updateExpenseRequest(expenseId, expenseData);
			} else {
				const id = await storeExpense(expenseData);
				addExpense({...expenseData, id: id});
			};
			navigation.goBack();
		} catch (err) {
			setIsLoading(false);
			setError(err.message);
		}
	};

	function cancelHandler() {
		navigation.goBack();
	};

	if (error && !isLoading) {
		return <ErrorOverlay message={error} onConfirm={() => setError(null)}/>
	};

	if (isLoading) {
		return <LoadingOverlay />;
	};

	return (
		<View style={styles.container}>
			<ExpenseForm
				onCancel={cancelHandler}
				onSubmit={confirmHandler}
				submitButtonLabel={isEditing ? 'Update' : 'Add'}
				defaultValues={selectedExpense}
			/>
			{isEditing && <View style={styles.deleteContainer}>
				<IconButton iconName='trash' color={GlobalStyles.colors.error500} size={36} onPress={deleteExpenseHandler} />
			</View>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		backgroundColor: GlobalStyles.colors.primary800,
	},
	deleteContainer: {
		marginTop: 16,
		paddingTop: 8,
		borderTopWidth: 2,
		borderTopColor: GlobalStyles.colors.primary200,
		alignItems: 'center',
	},
});
