import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ClaudeChatPage extends StatefulWidget {
  const ClaudeChatPage({super.key});

  @override
  State<ClaudeChatPage> createState() => _ClaudeChatPageState();
}

class _ClaudeChatPageState extends State<ClaudeChatPage> {
  final TextEditingController messageController = TextEditingController();
  final List<Map<String, String>> chatMessages = [];

  void sendMessage() {
    if (messageController.text.trim().isEmpty) return;

    setState(() {
      chatMessages.add({'role': 'user', 'text': messageController.text.trim()});
      messageController.clear();

      // Dummy Claude Response (you will replace this with real API call later)
      chatMessages.add({'role': 'claude', 'text': 'This is Claude’s answer to your question.'});
    });
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('loggedIn', false);
    Navigator.pushReplacementNamed(context, '/login');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFE0F2EB),
      appBar: AppBar(
        title: const Text('InfoHealthAI Chat'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: logout,
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(10),
              itemCount: chatMessages.length,
              itemBuilder: (context, index) {
                final msg = chatMessages[index];
                final isUser = msg['role'] == 'user';
                return Container(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    padding: const EdgeInsets.all(10),
                    margin: const EdgeInsets.symmetric(vertical: 5),
                    decoration: BoxDecoration(
                      color: isUser ? Colors.tealAccent : Colors.white,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(msg['text'] ?? ''),
                  ),
                );
              },
            ),
          ),
          const Divider(height: 1),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            color: Colors.white,
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: messageController,
                    decoration: const InputDecoration(
                      hintText: 'Ask a question...',
                      border: InputBorder.none,
                    ),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.send),
                  onPressed: sendMessage,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
