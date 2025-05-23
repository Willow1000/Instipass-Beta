# InstiPass - Smart Student ID Registration System

Overview

InstiPass is a modern student ID registration system that simplifies and automates the ID issuance process. The system allows students to register online, upload their photos, and track the status of their ID issuance. It also enables institutions to efficiently manage student IDs while ensuring accurate and organized data storage.

# Features

Online Registration – Students can submit their details and photos digitally.

Institution-based ID Grouping – IDs are formatted based on institution and department.

Status Tracking & Notifications – Students receive real-time updates on their ID issuance.

Audit Log – Tracks all admin activities for accountability.

API Access Log – Monitors API requests and responses.


# Tech Stack

Backend: Django, Django REST Framework

Database: MySQL

Email: django.core.mail

Authentication: JWT (JSON Web Tokens) for API Endpoints & Oauth for Views 

Frontend: Bootstrap


Installation & Setup

Prerequisites

Ensure you have the following installed:

Python (>=3.8) ideally (3.13)

MySQL

Virtualenv


# Setup Instructions

1. Clone the repository:

git clone <repository-url>
cd instipass


2. Create and activate a virtual environment:

python -m venv venv
source venv/bin/activate  # On Windows use venv\Scripts\activate


3. Install dependencies:

pip install -r requirements.txt


4. Configure environment variables in a .env file:



5. Apply database migrations:

python manage.py migrate


6. Create a superuser:

python manage.py createsuperuser


7. Run the development server:

python manage.py runserver



# Endpoints

Usage:
# STUDENT
1. Students register and submit their details via the API.
Urls:


# Api
/student/api/student - handles student profile

# Views
/student/register - registering student profile

# INSTITUTION
2. Institutions review and approve registrations.
Urls:

# Api
/institution/api/institution - handles institution profiles

/institution/api/institution_settings - handles institution settings

/institution/api/institution_stats - summary on the Id registration progress of the logged in institution

# Views
/institution/register - register institution profile

/institution/settings/register - register institution settings

# API ENDPOINTS SUMMARY
/api/schema/redoc or /api/schema/swagger-ui - for a more informative and nicer looking summary of the API endpoints

3. Students receive notifications on their ID issuance status.


4. The system logs API access and admin actions for security and monitoring.

# Creating User
To create register as a Student User:

/student/accounts/signup/ 

To create an Institution User:

/institution/accounts/signup/

Alternatively
1. Head to the root homepage /  
2. Click on "Who are you" on the navbar
3. Select the option of your choice
4. Proceed to signup and submit the form
5. Use your credentials to obtain tokens for you to access the Api endpoints

# Future Enhancements
Integrating with school DBs for easy data retrieval

Integration with external authentication providers.

Advanced analytics for ID issuance trends.

Enhanced UI/UX for better user experience.

Integrating with AI for image quality enhancement

Implementing Back up with Google or any other cloud services to store Digital IDs

Implementing web3 security to avoid identity theft
