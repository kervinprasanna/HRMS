import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';
import { COLORS } from '../constants/theme';
import LoginScreen from '../screens/auth/LoginScreen';
import EmployeeListScreen from '../screens/main/EmployeeListScreen';
import AddEmployeeScreen from '../screens/main/AddEmployeeScreen';
import EmployeeDetailScreen from '../screens/main/EmployeeDetailScreen';
import CreateRequestScreen from '../screens/main/CreateRequestScreen';
import RequestDetailScreen from '../screens/main/RequestDetailScreen';
import SalaryHistoryScreen from '../screens/main/SalaryHistoryScreen';
import PayslipScreen from '../screens/main/PayslipScreen';
import PayrollScreen from '../screens/main/PayrollScreen';
import CreatePayslipScreen from '../screens/main/CreatePayslipScreen';
import AttendanceScreen from '../screens/main/AttendanceScreen';
import RecruitmentScreen from '../screens/main/RecruitmentScreen';
import CreateJobScreen from '../screens/main/CreateJobScreen';
import CandidateDetailScreen from '../screens/main/CandidateDetailScreen';
import AssetsScreen from '../screens/main/AssetsScreen';
import AddAssetScreen from '../screens/main/AddAssetScreen';
import AssetDetailScreen from '../screens/main/AssetDetailScreen';
import HRAttendanceScreen from '../screens/main/HRAttendanceScreen';
import AttendanceDetailScreen from '../screens/main/AttendanceDetailScreen';
import CredentialsScreen from '../screens/main/CredentialsScreen';
import UploadDocumentScreen from '../screens/main/UploadDocumentScreen';
import PerformanceDashboardScreen from '../screens/main/PerformanceDashboardScreen';
import HRPerformanceScreen from '../screens/main/HRPerformanceScreen';
import ManagePerformanceScreen from '../screens/main/ManagePerformanceScreen';
import LMSEEScreen from '../screens/main/LMSEEScreen';
import LMSDashboardScreen from '../screens/main/LMSDashboardScreen';
import EngagementScreen from '../screens/main/EngagementScreen';
import CreateEngagementScreen from '../screens/main/CreateEngagementScreen';
import HRLMSTrackerScreen from '../screens/main/HRLMSTrackerScreen';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  const CustomTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
      background: isDarkMode ? COLORS.dark.background : COLORS.light.background,
      card: isDarkMode ? COLORS.dark.surface : COLORS.light.surface,
      text: isDarkMode ? COLORS.dark.text : COLORS.light.text,
      border: isDarkMode ? COLORS.dark.border : COLORS.light.border,
      primary: isDarkMode ? COLORS.dark.primary : COLORS.light.primary,
    },
  };

  return (
    <NavigationContainer theme={CustomTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // Logged in user sees the main tabs
            <Stack.Group>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="EmployeeList" component={EmployeeListScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="AddEmployee" component={AddEmployeeScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="EmployeeDetail" component={EmployeeDetailScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="CreateRequest" component={CreateRequestScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="RequestDetail" component={RequestDetailScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="SalaryHistory" component={SalaryHistoryScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="Payslip" component={PayslipScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="Payroll" component={PayrollScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="CreatePayslip" component={CreatePayslipScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="Attendance" component={AttendanceScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="Recruitment" component={RecruitmentScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="CreateJob" component={CreateJobScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="CandidateDetail" component={CandidateDetailScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="Assets" component={AssetsScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="AddAsset" component={AddAssetScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="AssetDetail" component={AssetDetailScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="HRAttendance" component={HRAttendanceScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="AttendanceDetail" component={AttendanceDetailScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="Credentials" component={CredentialsScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="UploadDocument" component={UploadDocumentScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="PerformanceDashboard" component={PerformanceDashboardScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="HRPerformance" component={HRPerformanceScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="ManagePerformance" component={ManagePerformanceScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="LMSEE" component={LMSEEScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="LMSDashboard" component={LMSDashboardScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="Engagement" component={EngagementScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="CreateEngagement" component={CreateEngagementScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="HRLMSTracker" component={HRLMSTrackerScreen} options={{ presentation: 'modal' }} />
          </Stack.Group>
        ) : (
          // Not logged in user sees the login screen
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
