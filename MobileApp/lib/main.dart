import 'package:flutter/material.dart';

void main() {
  runApp(const AetherCompanionApp());
}

class AetherCompanionApp extends StatelessWidget {
  const AetherCompanionApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Aether AVR Companion',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0B0D13),
        primaryColor: const Color(0xFFAA3BFF),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFFAA3BFF),
          secondary: Color(0xFF00E5FF),
          surface: Color(0xFF161922),
          background: Color(0xFF0B0D13),
          error: Color(0xFFFF4E6E),
        ),
        cardTheme: CardTheme(
          color: const Color(0xFF161922),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: const BorderSide(color: Color(0xFF282C3D), width: 1),
          ),
          elevation: 0,
        ),
        useMaterial3: true,
      ),
      home: const CompanionDashboard(),
    );
  }
}

class CompanionDashboard extends StatefulWidget {
  const CompanionDashboard({super.key});

  @override
  State<CompanionDashboard> createState() => _CompanionDashboardState();
}

class _CompanionDashboardState extends State<CompanionDashboard> {
  bool _isConnected = true;
  double _brightness = 75.0;
  double _volume = 50.0;
  bool _spatialSync = true;
  bool _notifications = true;
  
  String _activeGesture = 'Idle';
  Offset _touchPosition = Offset.zero;

  void _handleTouch(DragUpdateDetails details, Size size) {
    setState(() {
      _touchPosition = details.localPosition;
      
      // Classify gestures dynamically based on drag vectors
      if (details.delta.dy < -5) {
        _activeGesture = 'Swipe Up (Brightness Up)';
      } else if (details.delta.dy > 5) {
        _activeGesture = 'Swipe Down (Brightness Down)';
      } else if (details.delta.dx > 5) {
        _activeGesture = 'Swipe Right (Next Workspace)';
      } else if (details.delta.dx < -5) {
        _activeGesture = 'Swipe Left (Prev Workspace)';
      } else {
        _activeGesture = 'Tapping / Pointing';
      }
    });
  }

  void _handleTouchEnd(DragEndDetails details) {
    Future.delayed(const Duration(milliseconds: 600), () {
      if (mounted) {
        setState(() {
          _activeGesture = 'Idle';
          _touchPosition = Offset.zero;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF0B0D13),
        elevation: 0,
        centerTitle: false,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFFAA3BFF), Color(0xFF00E5FF)],
                ),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.blur_on, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'AETHER AVR',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                ),
                Text(
                  _isConnected ? 'COMPANION SYNCED' : 'OFFLINE',
                  style: TextStyle(
                    fontSize: 9, 
                    fontWeight: FontWeight.w600, 
                    color: _isConnected ? const Color(0xFF00E5FF) : Colors.grey,
                    letterSpacing: 0.5
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(
              _isConnected ? Icons.bluetooth_connected : Icons.bluetooth_disabled,
              color: _isConnected ? const Color(0xFF00E5FF) : Colors.red,
            ),
            onPressed: () {
              setState(() {
                _isConnected = !_isConnected;
              });
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Section: Telemetry / Glass Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Aether Glass Gen-1',
                              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              _isConnected ? 'Battery: 88% • Temp: 38°C' : 'Connection Lost',
                              style: const TextStyle(fontSize: 13, color: Colors.grey),
                            ),
                          ],
                        ),
                        Container(
                          width: 14,
                          height: 14,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: _isConnected ? const Color(0xFF00E5FF) : Colors.red,
                            boxShadow: [
                              BoxShadow(
                                color: (_isConnected ? const Color(0xFF00E5FF) : Colors.red).withOpacity(0.4),
                                blurRadius: 10,
                                spreadRadius: 2,
                              )
                            ]
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _buildStatColumn('NPU LOAD', '42%', Icons.memory, theme.colorScheme.primary),
                        _buildStatColumn('VIO SLAM', '90 FPS', Icons.track_changes, theme.colorScheme.secondary),
                        _buildStatColumn('SIGNAL', '-45 dBm', Icons.wifi, const Color(0xFF00E5FF)),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Section: Touchpad / Gesture Panel
            const Text(
              'SPATIAL TOUCHPAD CONTROL',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 1),
            ),
            const SizedBox(height: 8),
            Card(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Container(
                  height: 240,
                  width: double.infinity,
                  color: const Color(0xFF0F111A),
                  child: Stack(
                    children: [
                      // Grid lines effect
                      Positioned.fill(
                        child: Opacity(
                          opacity: 0.05,
                          child: GridPaper(
                            color: theme.colorScheme.secondary,
                            interval: 50,
                            subdivisions: 1,
                          ),
                        ),
                      ),
                      // Gesture recognition detector
                      Positioned.fill(
                        child: GestureDetector(
                          onPanUpdate: (details) => _handleTouch(details, const Size(double.infinity, 240)),
                          onPanEnd: _handleTouchEnd,
                          onTap: () {
                            setState(() {
                              _activeGesture = 'Tap (Trigger Selection)';
                            });
                            _handleTouchEnd(DragEndDetails());
                          },
                          child: Container(color: Colors.transparent),
                        ),
                      ),
                      // Interactive touch point indicator
                      if (_touchPosition != Offset.zero)
                        Positioned(
                          left: _touchPosition.dx - 25,
                          top: _touchPosition.dy - 25,
                          child: Container(
                            width: 50,
                            height: 50,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: RadialGradient(
                                colors: [
                                  theme.colorScheme.secondary.withOpacity(0.6),
                                  Colors.transparent,
                                ],
                              ),
                            ),
                          ),
                        ),
                      // Dynamic gesture output readout
                      Positioned(
                        bottom: 16,
                        left: 16,
                        right: 16,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'ACTIVE GLASS GESTURE',
                                  style: TextStyle(fontSize: 9, color: Colors.grey, letterSpacing: 0.5),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  _activeGesture,
                                  style: TextStyle(
                                    fontSize: 15, 
                                    fontWeight: FontWeight.bold, 
                                    color: _activeGesture == 'Idle' ? Colors.grey : theme.colorScheme.secondary
                                  ),
                                ),
                              ],
                            ),
                            Icon(Icons.touch_app, color: theme.colorScheme.secondary.withOpacity(0.5)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Section: Quick settings sliders
            const Text(
              'OPTICAL DISPLAY CONFIGURATION',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 1),
            ),
            const SizedBox(height: 8),
            Card(
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 12.0, horizontal: 16.0),
                child: Column(
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.wb_sunny, size: 20, color: Colors.amber),
                        const SizedBox(width: 12),
                        const Text('Waveguide Brightness', style: TextStyle(fontSize: 14)),
                        Expanded(
                          child: Slider(
                            value: _brightness,
                            min: 10.0,
                            max: 100.0,
                            activeColor: const Color(0xFF00E5FF),
                            onChanged: _isConnected ? (val) {
                              setState(() {
                                _brightness = val;
                              });
                            } : null,
                          ),
                        ),
                        Text('${_brightness.round()}%', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                      ],
                    ),
                    const Divider(color: Color(0xFF282C3D), height: 16),
                    Row(
                      children: [
                        const Icon(Icons.volume_up, size: 20, color: Color(0xFFAA3BFF)),
                        const SizedBox(width: 12),
                        const Text('Bone Audio Volume', style: TextStyle(fontSize: 14)),
                        Expanded(
                          child: Slider(
                            value: _volume,
                            min: 0.0,
                            max: 100.0,
                            activeColor: const Color(0xFFAA3BFF),
                            onChanged: _isConnected ? (val) {
                              setState(() {
                                _volume = val;
                              });
                            } : null,
                          ),
                        ),
                        Text('${_volume.round()}%', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Section: Synced Toggles
            Card(
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Column(
                  children: [
                    SwitchListTile(
                      title: const Text('Spatial Map Synchronization', style: TextStyle(fontSize: 14)),
                      subtitle: const Text('Persistent global anchor alignment', style: TextStyle(fontSize: 11, color: Colors.grey)),
                      value: _spatialSync,
                      activeColor: const Color(0xFF00E5FF),
                      onChanged: _isConnected ? (val) {
                        setState(() {
                          _spatialSync = val;
                        });
                      } : null,
                    ),
                    const Divider(color: Color(0xFF282C3D), height: 8),
                    SwitchListTile(
                      title: const Text('Notification Forwarding', style: TextStyle(fontSize: 14)),
                      subtitle: const Text('Mirror phone notifications on HUD', style: TextStyle(fontSize: 11, color: Colors.grey)),
                      value: _notifications,
                      activeColor: const Color(0xFF00E5FF),
                      onChanged: _isConnected ? (val) {
                        setState(() {
                          _notifications = val;
                        });
                      } : null,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatColumn(String label, String value, IconData icon, Color color) {
    return Column(
      children: [
        Icon(icon, color: color, size: 22),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white, fontFamily: 'monospace'),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: const TextStyle(fontSize: 9, color: Colors.grey, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }
}
