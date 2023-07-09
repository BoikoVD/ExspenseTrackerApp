import { StyleSheet, View, Text, FlatList } from 'react-native';

import ExpensesItem from './ExpenseItem';

export default function ExpensesList({ expenses }) {
	return (
		<FlatList
			data={expenses}
			renderItem={(itemData) => {
				return (
					<ExpensesItem {...itemData.item} />
				);
			}}
			keyExtractor={(item) => item.id}
		/>
	);
}

const styles = StyleSheet.create({
	container: {

	},
});
