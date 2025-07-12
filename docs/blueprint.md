# **App Name**: NeuroVision

## Core Features:

- DICOM Upload: Enables upload of brain CT scans in DICOM format via drag-and-drop or file picker, supporting batch uploads and file validation.
- AI-Enhanced Preprocessing: Uses an AI tool powered by Gemini to preprocess CT scan images. This includes rescaling, normalizing pixel values, cropping to the brain region, and applying noise reduction techniques.
- AI-Powered Tumor Detection: Integrates a pre-trained deep learning model (e.g., 3D CNN, EfficientNetB2, or YOLOv5) fine-tuned for brain tumor detection, providing confidence scores for classifications and uses Gradient-weighted Class Activation Mapping (Grad-CAM) to generate heatmaps that highlight regions of interest.
- Interactive 3D Visualization: Reconstructs a 3D volume from 2D CT scan slices using Three.js, providing interactive controls for rotation, zoom, panning, and toggling visibility of tumor regions, overlaid with Grad-CAM heatmaps.
- Results Panel & Reporting: Displays AI predictions including tumor presence, type, confidence score, and Grad-CAM heatmaps, with options to download a PDF report summarizing the analysis.
- Deployment & Monitoring: Deploys the app on Firebase App Hosting with integrated Firebase Console for performance monitoring, usage analytics, and error tracking, ensuring scalability and reliability.

## Style Guidelines:

- Primary color: Deep Blue (#2962FF), evoking trust and intelligence.
- Background color: Light Gray (#F0F4F9), provides a clean and professional backdrop.
- Accent color: Teal (#26A69A), used for interactive elements and highlights to draw attention.
- Headline font: 'Space Grotesk' sans-serif font for headlines; body font: 'Inter' sans-serif font for body text. Note: currently only Google Fonts are supported.
- Use a consistent set of clear, modern icons, primarily in the Teal accent color, to represent actions and data types. Icons should be simple and easily recognizable.
- A clean, well-organized layout with clear visual hierarchy. Use whitespace effectively to avoid clutter. The 3D visualization panel should dominate the screen, with upload and results sections arranged logically around it.
- Subtle animations (e.g., smooth transitions, loading indicators) to improve user experience without being distracting. Use animation to provide feedback and guide the user through the app.