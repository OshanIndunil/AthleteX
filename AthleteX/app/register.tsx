import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/store';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const registerSchema = yup.object({
  fullName: yup.string().required('Full Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
}).required();

export default function RegisterScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema)
  });

  const onRegister = async (data: any) => {
    setLoading(true);
    
    setTimeout(() => {
        const dummyUser = {
            id: Date.now(),
            username: data.email.split('@')[0],
            firstName: data.fullName,
            email: data.email,
            image: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' 
        };

        dispatch(loginSuccess({ user: dummyUser, token: 'dummy-register-token' }));
        Alert.alert("Welcome!", "Account created successfully.");
        
        setTimeout(() => {
            setLoading(false);
            router.replace('/home');
        }, 500);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <LinearGradient colors={['#007bff', '#0056b3']} style={styles.header}>
             <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/747/747376.png' }} style={styles.logo} />
             <Text style={styles.headerTitle}>Create Account</Text>
             {/* UPDATED TEXT HERE */}
             <Text style={styles.headerSubtitle}>Join AthleteX today!</Text>
        </LinearGradient>

        <View style={styles.formContainer}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
                <Feather name="user" size={20} color="#666" style={styles.icon} />
                <Controller
                    control={control}
                    name="fullName"
                    render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput style={styles.input} onBlur={onBlur} onChangeText={onChange} value={value} placeholder="John Doe" />
                    )}
                />
            </View>
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}

            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputContainer}>
                <Feather name="mail" size={20} color="#666" style={styles.icon} />
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput style={styles.input} onBlur={onBlur} onChangeText={onChange} value={value} placeholder="john@example.com" keyboardType="email-address" autoCapitalize="none" />
                    )}
                />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
                <Feather name="lock" size={20} color="#666" style={styles.icon} />
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput style={styles.input} onBlur={onBlur} onChangeText={onChange} value={value} placeholder="******" secureTextEntry />
                    )}
                />
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputContainer}>
                <Feather name="check-circle" size={20} color="#666" style={styles.icon} />
                <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput style={styles.input} onBlur={onBlur} onChangeText={onChange} value={value} placeholder="******" secureTextEntry />
                    )}
                />
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleSubmit(onRegister)} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? "Creating Account..." : "SIGN UP"}</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.link}>Log In</Text>
                </TouchableOpacity>
            </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { height: 250, justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  logo: { width: 80, height: 80, marginBottom: 15, tintColor: 'white' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  headerSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 5 },
  formContainer: { flex: 1, padding: 25, marginTop: -30, backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 15 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 12, paddingHorizontal: 15, borderWidth: 1, borderColor: '#eee' },
  icon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 15, fontSize: 16, color: '#333' },
  errorText: { color: '#ff4757', fontSize: 12, marginTop: 5, marginLeft: 5 },
  button: { backgroundColor: '#007bff', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 30, shadowColor: '#007bff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 25, marginBottom: 20 },
  footerText: { color: '#666' },
  link: { color: '#007bff', fontWeight: 'bold' },
});