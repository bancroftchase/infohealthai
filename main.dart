import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'splash_page.dart';
import 'login_page.dart';
import 'register_page.dart';
import 'claude_chat_page.dart';
import 'portal_page.dart';

void main() {
  runApp(const InfoHealthAIApp());
}

class InfoHealthAIApp extends StatelessWidget {
  const InfoHealthAIApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'InfoHealthAI',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.teal,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const SplashPage(),
        '/login': (context) => const LoginPage(),
        '/register': (context) => const RegisterPage(),
        '/chat': (context) => const ClaudeChatPage(),
        '/portal': (context) => const PortalPage(),
      },
    );
  }
}
