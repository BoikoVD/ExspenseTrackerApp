import { StyleSheet, View, Pressable, Text } from 'react-native';
import { GlobalStyles } from '../../constants/styles';

export default function Button({ children, onPress, mode, style }) {
	return (
		<View style={style}>
			<Pressable onPress={onPress} style={({pressed}) => pressed && styles.pressed}>
				<View style={[styles.container, mode === 'flat' && styles.flat]}>
					<Text style={[styles.text, mode === 'flat' && styles.flatText]}>{children}</Text>
				</View>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		borderRadius: 4,
		padding: 8,
		backgroundColor: GlobalStyles.colors.primary500,
	},
	flat: {
		backgroundColor: 'transparent'
	},
	pressed: {
		opacity: 0.75,
		backgroundColor: GlobalStyles.colors.primary100,
		borderRadius: 4,
	},
	text: {
		color: 'white',
		textAlign: 'center',
	},
	flatText: {
		color: GlobalStyles.colors.primary200
	}
});
