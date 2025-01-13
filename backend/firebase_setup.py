import os
import firebase_admin
from firebase_admin import credentials, auth

# need to add this file to the folder as mentioned in the documentation
cred = credentials.Certificate("hack4good2025-edf21-firebase-adminsdk-th8ca-80fdd6a5f7.json")

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

admin_auth = auth 

