import { View, Text, Button } from 'react-native';
import { useAuth } from '@/hooks/use-auth';

export default function LoginScreen() {
  const { login } = useAuth();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Login</Text>
      <Button title="Fake Login" onPress={() => login("FAKE.TOKEN.HERE")} />
    </View>
  );
}
