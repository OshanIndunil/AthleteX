import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/store'; 
import axios from 'axios';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const loginSchema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
}).required();

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(false);
  const isSubmitting = useRef(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema)
  });

  const onLogin = async (data: any) => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;
    setLoading(true);

    const usernameInput = data.username.trim();
    const passwordInput = data.password.trim();

    console.log("Attempting login:", usernameInput);

    // --- SUPER USER ---
    if (usernameInput.toLowerCase() === 'oshan' && passwordInput === 'Test#123') {
        console.log("✅ Super user matched! Navigating...");
        
        const adminUser = {
            id: 999,
            username: 'oshan',
            firstName: 'Oshan',
            lastName: 'Indunil',
            email: 'oshan@test.com',
            image: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png'
        };
        
        dispatch(loginSuccess({ user: adminUser, token: 'admin-token-123' }));
        
        // SIMPLE NAVIGATION FIX
        setTimeout(() => {
            console.log("Pushing to tabs...");
            router.replace('/(tabs)'); 
        }, 100);
        return; 
    }

    // --- API LOGIN ---
    try {
      const response = await axios.post('https://dummyjson.com/auth/login', {
        username: usernameInput, 
        password: passwordInput, 
      });

      console.log("✅ API Login Success!");
      dispatch(loginSuccess({ user: response.data, token: response.data.token }));
      
      setTimeout(() => {
        console.log("Pushing to tabs...");
        router.replace('/(tabs)');
      }, 100);
      
    } catch (error) {
      console.log("❌ Login Error");
      isSubmitting.current = false;
      setLoading(false);
      Alert.alert("Login Failed", "Invalid username or password.");
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <LinearGradient colors={['#007bff', '#0056b3']} style={styles.header}>
            <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/732/732205.png' }} 
                style={styles.logo} 
            />
            <Text style={styles.headerTitle}>Welcome Back!</Text>
            <Text style={styles.headerSubtitle}>Login to continue to Sportify</Text>
        </LinearGradient>

        <View style={styles.formContainer}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputContainer}>
                <Feather name="user" size={20} color="#666" style={styles.icon} />
                <Controller
                    control={control}
                    name="username"
                    render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="Oshan"
                        autoCapitalize="none"
                    />
                    )}
                />
            </View>
            {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
                <Feather name="lock" size={20} color="#666" style={styles.icon} />
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        secureTextEntry
                        placeholder="Test#123"
                    />
                    )}
                />
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleSubmit(onLogin)} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? "Logging in..." : "LOGIN"}</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/register')}>
                    <Text style={styles.link}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { height: 300, justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  logo: { width: 100, height: 100, marginBottom: 20, tintColor: 'white' },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: 'white' },
  headerSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 5 },
  formContainer: { flex: 1, padding: 25, marginTop: -40, backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 15 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 12, paddingHorizontal: 15, borderWidth: 1, borderColor: '#eee' },
  icon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 15, fontSize: 16, color: '#333' },
  errorText: { color: '#ff4757', fontSize: 12, marginTop: 5, marginLeft: 5 },
  button: { backgroundColor: '#007bff', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 30, shadowColor: '#007bff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 25 },
  footerText: { color: '#666' },
  link: { color: '#007bff', fontWeight: 'bold' },
});