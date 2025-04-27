import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class PortalPage extends StatefulWidget {
  const PortalPage({super.key});

  @override
  State<PortalPage> createState() => _PortalPageState();
}

class _PortalPageState extends State<PortalPage> {
  final TextEditingController weightGoalController = TextEditingController();
  final TextEditingController notesController = TextEditingController();
  final TextEditingController reminderController = TextEditingController();
  final TextEditingController reminderTimeController = TextEditingController();

  Future<void> savePortalData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('weightGoal', weightGoalController.text);
    await prefs.setString('notes', notesController.text);
    await prefs.setString('reminder', reminderController.text);
    await prefs.setString('reminderTime', reminderTimeController.text);

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Portal data saved!')),
    );
  }

  Future<void> loadPortalData() async {
    final prefs = await SharedPreferences.getInstance();
    weightGoalController.text = prefs.getString('weightGoal') ?? '';
    notesController.text = prefs.getString('notes') ?? '';
    reminderController.text = prefs.getString('reminder') ?? '';
    reminderTimeController.text = prefs.getString('reminderTime') ?? '';
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('loggedIn', false);
    Navigator.pushReplacementNamed(context, '/login');
  }

  @override
  void initState() {
    super.initState();
    loadPortalData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFE0F2EB),
      appBar: AppBar(
        title: const Text('My Health Portal'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: logout,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(30),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Health Goals', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            TextField(
              controller: weightGoalController,
              decoration: const InputDecoration(labelText: 'Target Weight (lbs or kg)'),
            ),
            const SizedBox(height: 20),
            const Text('Important Notes', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            TextField(
              controller: notesController,
              maxLines: 5,
              decoration: const InputDecoration(labelText: 'Notes...'),
            ),
            const SizedBox(height: 20),
            const Text('Reminders', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            TextField(
              controller: reminderController,
              decoration: const InputDecoration(labelText: 'Reminder Task (e.g., take medication)'),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: reminderTimeController,
              decoration: const InputDecoration(labelText: 'Reminder Time (e.g., 8:00 AM)'),
            ),
            const SizedBox(height: 30),
            ElevatedButton(
              onPressed: savePortalData,
              child: const Text('Save Portal Info'),
            ),
          ],
        ),
      ),
    );
  }
}
