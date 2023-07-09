import { useContext, useEffect, useState } from 'react';

import ExpensesOutput from '../components/ExpensesOutput/ExpensesOutput';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import ErrorOverlay from '../components/UI/ErrorOverlay';

import { ExpensesContext } from '../store/expenses-context';
import { getDateMinusDays } from '../util/date';
import { getExpenses } from '../util/http';

export default function RecentExpenses() {
	const { expenses, setExpenses } = useContext(ExpensesContext);

	const [isFetching, setIsFetching] = useState(true);
	const [error, setError] = useState();

	const recentExpenses = expenses.filter((expense) => {
		const today = new Date();
		const date7DaysAgo = getDateMinusDays(today, 7);
		return (expense.date >= date7DaysAgo) && (expense.date <= today);
	});

	useEffect(() => {
		async function fetch() {
			setIsFetching(true);
			try {
				const expenses = await getExpenses();
				setExpenses(expenses);
			} catch (err) {
				setError(err.message);
			}
			setIsFetching(false);
		};

		fetch();
	}, []);

	if (error && !isFetching) {
		return <ErrorOverlay message={error} onConfirm={() => setError(null)}/>
	};

	if (isFetching) {
		return <LoadingOverlay />
	};

	return (
		<ExpensesOutput
			expensesPeriod='Last 7 days'
			expenses={recentExpenses}
			fallbackText='No expenses registered for the last 7 days'
		/>
	);
};
