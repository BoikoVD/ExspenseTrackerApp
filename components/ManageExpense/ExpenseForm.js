import { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import Input from './Input';
import Button from '../UI/Button';

import { GlobalStyles } from '../../constants/styles';
import { getFormatedDate } from '../../util/date';

export default function ExpenseForm({ onCancel, onSubmit, submitButtonLabel, defaultValues, style }) {
	const [inputs, setInputs] = useState({
		amount: {
			value: defaultValues ? defaultValues.amount.toString() : '',
			isValid: true,
		},
		date: {
			value: defaultValues ? getFormatedDate(defaultValues.date) : '',
			isValid: true,
		},
		description: {
			value: defaultValues ? defaultValues.description : '',
			isValid: true,
		},
	});

	function inputChangeHandler(inputIdentifier, value) {
		setInputs((currentInputs) => {
			return {
				...currentInputs,
				[inputIdentifier]: {
					value: value,
					isValid: true
				}
			};
		});
	};

	function submitHandler() {
		const expenseData = {
			amount: +inputs.amount.value,
			date: new Date(inputs.date.value),
			description: inputs.description.value
		};

		const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
		const dateIsValid = expenseData.date.toString() !== 'Invalid Date';
		const descriptionIsValid = expenseData.description.trim().length > 0;

		if (!amountIsValid || !dateIsValid || !descriptionIsValid) {
			setInputs((currentInputs) => {
				return {
					amount: { value: currentInputs.amount.value, isValid: amountIsValid },
					date: { value: currentInputs.date.value, isValid: dateIsValid },
					description: { value: currentInputs.description.value, isValid: descriptionIsValid },
				};
			});
			return;
		};

		onSubmit(expenseData);
	};

	const formIsInvalid = !inputs.amount.isValid || !inputs.date.isValid || !inputs.description.isValid;

	return (
		<View style={[styles.form, style]}>
			<Text style={styles.title}>Your Expense</Text>
			<View style={styles.inputsRow}>
				<Input
					label='Amount'
					style={styles.rowInput}
					isInvalid={!inputs.amount.isValid}
					textInputConfig={{
						keyboardType: 'decimal-pad',
						value: inputs.amount.value,
						onChangeText: inputChangeHandler.bind(this, 'amount'),
					}}
				/>
				<Input
					label='Date'
					style={styles.rowInput}
					isInvalid={!inputs.date.isValid}
					textInputConfig={{
						placeholder: 'YYYY-MM-DD',
						maxLength: 10,
						value: inputs.date.value,
						onChangeText: inputChangeHandler.bind(this, 'date'),
					}}
				/>
			</View>
			<Input
				label='Description'
				isInvalid={!inputs.description.isValid}
				textInputConfig={{
					multiline: true,
					value: inputs.description.value,
					onChangeText: inputChangeHandler.bind(this, 'description'),	
				}}
			/>
			{formIsInvalid && <Text style={styles.validationMessage}>Invalid input values - please check your entered data!</Text>}
			<View style={styles.buttonsContainer}>
				<Button mode='flat' onPress={onCancel} style={styles.button}>
					Cancel
				</Button>
				<Button onPress={submitHandler} style={styles.button}>
					{submitButtonLabel}
				</Button>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	form: {
		marginTop: 40,
	},
	title: {
		fontSize: 18,
		fontWeight: 700,
		color: 'white',
		marginVertical: 24,
		textAlign: 'center',
	},
	inputsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	rowInput: {
		flex: 1,
	},
	buttonsContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	button: {
		minWidth: 120,
		marginHorizontal: 8,
	},
	validationMessage: {
		textAlign: 'center',
		color: GlobalStyles.colors.error500,
		margin: 8,
	},
});
