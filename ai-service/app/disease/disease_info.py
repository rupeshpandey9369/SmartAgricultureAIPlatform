"""
Disease information database.
Maps disease class names (matching trained model's class_indices) to
human-readable info: symptoms, treatment, prevention.

CLASS_NAMES order below matches the Colab training run's class_indices
exactly (Pepper, Potato, Tomato - 15 classes from PlantVillage subset).
"""

DISEASE_INFO = {
    "Pepper__bell___Bacterial_spot": {
        "disease_name": "Bell Pepper Bacterial Spot",
        "symptoms": "Small, water-soaked spots on leaves that turn dark brown/black with yellow halos; spots on fruit appear raised and scab-like.",
        "treatment": "Apply copper-based bactericide. Remove and destroy infected plant debris. Avoid working in fields when foliage is wet.",
        "prevention": "Use certified disease-free seed. Rotate crops with non-pepper species for 2-3 years. Avoid overhead irrigation."
    },
    "Pepper__bell___healthy": {
        "disease_name": "Healthy Bell Pepper",
        "symptoms": "No visible disease symptoms detected.",
        "treatment": "No treatment needed.",
        "prevention": "Continue regular monitoring, balanced fertilization, and proper irrigation."
    },
    "Potato___Early_blight": {
        "disease_name": "Potato Early Blight",
        "symptoms": "Brown concentric-ring spots on older leaves, yellowing tissue around lesions, reduced tuber size.",
        "treatment": "Apply mancozeb or chlorothalonil-based fungicide at first sign of spots.",
        "prevention": "Maintain consistent watering to reduce plant stress. Rotate with non-solanaceous crops."
    },
    "Potato___Late_blight": {
        "disease_name": "Potato Late Blight",
        "symptoms": "Dark blotches on leaves with pale green halos, rapid wilting, white mold under leaves in moist weather, tuber rot in storage.",
        "treatment": "Apply systemic fungicide (e.g. metalaxyl-based). Destroy infected foliage; harvest early if outbreak is severe.",
        "prevention": "Plant certified disease-free seed potatoes. Hill soil around stems. Avoid excess nitrogen fertilizer."
    },
    "Potato___healthy": {
        "disease_name": "Healthy Potato",
        "symptoms": "No visible disease symptoms detected.",
        "treatment": "No treatment needed.",
        "prevention": "Continue regular monitoring and balanced fertilization."
    },
    "Tomato_Bacterial_spot": {
        "disease_name": "Tomato Bacterial Spot",
        "symptoms": "Small dark, greasy-looking spots on leaves and fruit; spots may merge causing leaf yellowing and drop.",
        "treatment": "Apply copper-based bactericide. Remove infected plant material. Avoid overhead watering.",
        "prevention": "Use disease-free seed and transplants. Rotate crops. Avoid working with plants when wet."
    },
    "Tomato_Early_blight": {
        "disease_name": "Tomato Early Blight",
        "symptoms": "Concentric dark rings on older leaves (target-spot pattern), yellowing around lesions, leaf drop starting from the bottom of the plant.",
        "treatment": "Apply fungicide containing chlorothalonil or mancozeb. Remove infected lower leaves promptly.",
        "prevention": "Mulch around base to prevent soil splash onto leaves. Space plants for airflow. Avoid wetting foliage when watering."
    },
    "Tomato_Late_blight": {
        "disease_name": "Tomato Late Blight",
        "symptoms": "Dark, water-soaked spots on leaves that grow rapidly; white fungal growth on undersides in humid conditions; brown lesions on stems and fruit.",
        "treatment": "Apply copper-based fungicide (e.g. copper oxychloride) every 7-10 days. Remove and destroy infected plant parts immediately.",
        "prevention": "Avoid overhead watering. Ensure good air circulation between plants. Rotate crops yearly. Use resistant varieties where available."
    },
    "Tomato_Leaf_Mold": {
        "disease_name": "Tomato Leaf Mold",
        "symptoms": "Pale green/yellow spots on upper leaf surface, olive-green to grayish-purple fuzzy mold on the underside.",
        "treatment": "Apply fungicide (chlorothalonil or copper-based). Improve ventilation, especially in greenhouses.",
        "prevention": "Reduce humidity around plants. Avoid overhead watering. Space plants well for airflow."
    },
    "Tomato_Septoria_leaf_spot": {
        "disease_name": "Tomato Septoria Leaf Spot",
        "symptoms": "Small circular spots with dark borders and gray/tan centers, tiny black specks visible in spot centers, severe leaf yellowing and drop.",
        "treatment": "Apply fungicide (chlorothalonil or mancozeb). Remove and destroy infected lower leaves.",
        "prevention": "Avoid overhead watering. Mulch to prevent soil splash. Rotate crops; avoid planting tomatoes in the same spot yearly."
    },
    "Tomato_Spider_mites_Two_spotted_spider_mite": {
        "disease_name": "Tomato Two-Spotted Spider Mite Infestation",
        "symptoms": "Fine yellow stippling on leaves, fine webbing on undersides and between leaves, leaves may turn bronze and dry out in heavy infestations.",
        "treatment": "Apply miticide or insecticidal soap. Increase humidity around plants, as mites thrive in dry conditions.",
        "prevention": "Regularly inspect undersides of leaves. Avoid excessive use of broad-spectrum pesticides that kill natural predators."
    },
    "Tomato__Target_Spot": {
        "disease_name": "Tomato Target Spot",
        "symptoms": "Brown lesions with concentric rings (target-like) on leaves, stems, and fruit; lesions may merge causing large necrotic areas.",
        "treatment": "Apply fungicide containing chlorothalonil or azoxystrobin. Remove and destroy infected plant debris.",
        "prevention": "Ensure good air circulation. Avoid overhead irrigation. Practice crop rotation."
    },
    "Tomato__Tomato_YellowLeaf__Curl_Virus": {
        "disease_name": "Tomato Yellow Leaf Curl Virus",
        "symptoms": "Upward curling and yellowing of leaves, stunted plant growth, reduced fruit set. Spread by whiteflies.",
        "treatment": "No cure once infected; remove and destroy infected plants to prevent spread. Control whitefly population with insecticide.",
        "prevention": "Use virus-resistant tomato varieties. Use reflective mulches and insect netting to deter whiteflies."
    },
    "Tomato__Tomato_mosaic_virus": {
        "disease_name": "Tomato Mosaic Virus",
        "symptoms": "Mottled light/dark green pattern on leaves, leaf curling and distortion, stunted growth, reduced fruit yield and quality.",
        "treatment": "No cure once infected; remove and destroy infected plants. Disinfect tools between plants.",
        "prevention": "Use certified virus-free seed. Wash hands and tools between handling plants. Control aphids which can spread the virus."
    },
    "Tomato_healthy": {
        "disease_name": "Healthy Tomato",
        "symptoms": "No visible disease symptoms detected.",
        "treatment": "No treatment needed.",
        "prevention": "Continue regular monitoring, balanced fertilization, and proper irrigation."
    },
}

# IMPORTANT: This order matches train_generator.class_indices exactly,
# confirmed from the Colab training run output.
CLASS_NAMES = [
    "Pepper__bell___Bacterial_spot",
    "Pepper__bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Tomato_Bacterial_spot",
    "Tomato_Early_blight",
    "Tomato_Late_blight",
    "Tomato_Leaf_Mold",
    "Tomato_Septoria_leaf_spot",
    "Tomato_Spider_mites_Two_spotted_spider_mite",
    "Tomato__Target_Spot",
    "Tomato__Tomato_YellowLeaf__Curl_Virus",
    "Tomato__Tomato_mosaic_virus",
    "Tomato_healthy",
]


def get_disease_info(class_name: str) -> dict:
    """Look up disease info by class name, with a safe fallback."""
    return DISEASE_INFO.get(class_name, {
        "disease_name": class_name.replace("_", " ").replace("___", " - "),
        "symptoms": "Symptom information not yet available for this class.",
        "treatment": "Consult a local agricultural extension officer for treatment guidance.",
        "prevention": "Practice crop rotation and field sanitation as general prevention."
    })
