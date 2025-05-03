#  3D Magnetic Field Explorer

An interactive 3D visualization tool for understanding magnetic fields around current-carrying wires and the right-hand rule.

![3D Magnetic Field Explorer](preview.gif)

## ✨ Features

### 🎮 Interactive Controls
- **Current Control**
  - Adjust current magnitude (0-20 Amperes)
  - Set current direction using X, Y, Z vectors
  - Real-time field strength visualization

### 🌐 3D Visualization
- Full 3D environment with orbit controls
- Magnetic field lines and animated particles
- Dynamic field strength representation
- Coordinate system with colored axes
- 3D compass for orientation

### 🎨 Customization
- Toggle field lines and particles
- Adjust field line density
- Control animation speed
- Multiple camera angles
- Dark theme interface

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (Python's `http.server` or any alternative)

### Quick Start
1. Clone the repository:
   ```bash
   git clone https://github.com/AleenaTahir1/Magnetic-Field-Simulator.git
   cd Magnetic-Field-Simulator
   ```

2. Start a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   ```

3. Open in your browser:
   ```
   http://localhost:8000
   ```

## 🎯 How to Use

1. **Set Current Properties**
   - Use the magnitude slider to adjust current strength
   - Control current direction with X, Y, Z vector components

2. **Explore the Visualization**
   - Left click + drag to rotate view
   - Right click + drag to pan
   - Scroll to zoom in/out
   - Use camera preset buttons for quick views

3. **Understand the Right-Hand Rule**
   - Point your right thumb in the direction of current
   - Your fingers naturally curl in the direction of the magnetic field

4. **Customize the View**
   - Toggle different visualization elements
   - Adjust field line density and animation speed
   - Switch between different viewing angles

## 🔧 Technical Details

Built using:
- Three.js for 3D visualization
- Modern JavaScript (ES6+)
- CSS Grid and Flexbox for layout
- Responsive design principles

## 👥 Authors

- Aleena Tahir ([@AleenaTahir1](https://github.com/AleenaTahir1))

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

Special thanks to:
- Three.js community for the 3D visualization library
- Our physics professors for guidance on electromagnetic theory
