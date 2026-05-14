# ETL Mini Project 🚀

This project is a hands-on ETL (Extract, Transform, Load) pipeline built using Python and Pandas.  
The goal of this mini project is to practice real-world data engineering concepts while working with a public dataset.

---

## 📂 Project Overview

The ETL process consists of:

1️⃣ **Extract**
- Load raw data from CSV (Titanic dataset)

2️⃣ **Transform**
- Data cleaning
- Handling missing values
- Feature engineering (e.g., Family Size)
- Encoding categorical variables
- Exploratory analysis

3️⃣ **Load**
- Save the clean dataset into a processed CSV file
- Optionally store into a database (future enhancement)

---

## 🧰 Tech Stack

| Tool / Library | Purpose |
|----------------|---------|
| Python | Primary programming language |
| Pandas | Data manipulation & cleaning |
| NumPy | Numerical operations |
| Jupyter Notebook | Interactive development & analysis |
| Git & GitHub | Version control |

---

## 📁 Project Structure

|-- .gitignore
|-- .ipynb_checkpoints
    |-- Untitled-checkpoint.ipynb
|-- etl_titanic.py
|-- processed_data
    |-- titanic.db
|-- raw_data
    |-- Titanic_Dataset.csv
|-- Untitled.ipynb


📊 Dataset Schema
1️⃣ Raw Dataset Schema (Before ETL)

| Column Name | Data Type   | Description                                     |
| ----------- | ----------- | ----------------------------------------------- |
| PassengerId | Integer     | Unique ID for each passenger                    |
| Survived    | Integer     | 0 = Did not survive, 1 = Survived               |
| Pclass      | Integer     | Ticket class (1 = Upper, 2 = Middle, 3 = Lower) |
| Name        | Object/Text | Full passenger name                             |
| Sex         | Object/Text | Gender of passenger                             |
| Age         | Float       | Age in years (missing for many passengers)      |
| SibSp       | Integer     | Siblings/spouses aboard ship                    |
| Parch       | Integer     | Parents/children aboard ship                    |
| Ticket      | Object/Text | Ticket number                                   |
| Fare        | Float       | Ticket price                                    |
| Cabin       | Object/Text | Cabin number (mostly missing)                   |
| Embarked    | Object/Text | Port of embarkation (S, C, Q)                   |


2️⃣ Cleaned Dataset Schema (After ETL Transformations)

| Column Name   | Data Type | Description                                      |
| ------------- | --------- | ------------------------------------------------ |
| PassengerId   | Integer   | Unique passenger identifier                      |
| Survived      | Integer   | Survival indicator (0/1)                         |
| Pclass        | Integer   | Socioeconomic class                              |
| Name          | Text      | Passenger name                                   |
| Sex           | Text      | Gender (Male/Female)                             |
| Age           | Float     | Cleaned age using median grouped by Pclass & Sex |
| SibSp         | Integer   | Onboard siblings/spouses count                   |
| Parch         | Integer   | Onboard parents/children count                   |
| Ticket        | Text      | Ticket identifier                                |
| Fare          | Float     | Ticket price                                     |
| Embarked      | Text      | Cleaned port category                            |
| Cabin Deck    | Text      | Extracted first letter of cabin (A–G, Unknown)   |
| Family Size   | Integer   | SibSp + Parch + 1 (including the passenger)      |
| Cabin Missing | Integer   | 1 if Cabin Deck is “Unknown”, else 0             |

