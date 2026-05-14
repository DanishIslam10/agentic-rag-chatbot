import pandas as pd
from pathlib import Path
import sqlite3
from save_embeddings import embed_and_upsert_openai_pinecone
from dotenv import load_dotenv

load_dotenv()


RAW_PATH = Path("raw_data/Titanic_Dataset.csv")
PROCESSED_DIR = Path("processed_data")
DB_PATH = PROCESSED_DIR / "titanic.db"
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

def extract(raw_path: Path) -> pd.DataFrame:
    # Extracting Data
    df = pd.read_csv(raw_path)

    print(df.head())
    print(df.info())
    print(df.dtypes)
    print(df.shape)

    return df


def transform(df: pd.DataFrame) -> pd.DataFrame:
    # Transforming Data (Basic Cleaning & Filtering)

    # 1.Remove rows having 'Fare' = 0
    filt = df['Fare'] > 0
    df = df[filt]

    # 1.Filling missing values in 'Age' column realistically by making groups of 'Pclass' and 'Sex' because 'Age' is highly depending on these two parameters
    df['Age'] = df.groupby(['Pclass','Sex'])['Age'].transform(lambda x: x.fillna(x.median()))

    # 2.Filling missing values in 'Embarked' column by the most common Port (mode)
    df['Embarked'] = df.groupby('Pclass')['Embarked'].transform(lambda x: x.fillna(x.mode()[0]))

    # 3.Filling missing 'Cabins'.
    '''
    IMPORTANT : 
    In the data set, we are given Cabin numbers (cabin deck + actual room number) , but it is not relevant because each 
    cabin number is unique and with these unique values no pattern can be observed. Instead, we just need to extract 
    the cabin deck (floor) so we can observe the pattern of survival. Higher the deck more chances to take the lifeboat 
    and survive, and higher deck are expensive and these people have more priority to be saved. So instead of finding 
    the missing cabins which is not possible, we should extract the cabin deck (first letter of cabin) and make a new column 
    named 'Cabin Deck'.
    '''
    df['Cabin Deck'] = df['Cabin'].str[0]

    # 4.Now fill missing values in 'Cabin Deck' column with 'Unknown'
    df['Cabin Deck'] = df['Cabin Deck'].fillna('Unknown')

    # 5.Dropping the 'Cabin' column.
    df.drop(columns=['Cabin'],inplace=True)

    # 6. Adding a new feature 'FamilySize'
    # FamilySize = SibSp + Parch + 1 (including the passenger themselves)
    # This feature is useful because group size strongly correlates with survival.
    # - Very small families (1–2 people) had higher survival chances (easier to help/evacuate)
    # - Very large families struggled to stay together during evacuation → lower survival rate
    df['Family Size'] = df['SibSp'] + df['Parch'] + 1

    # 7. Adding a feature to seperately indicate if the Cabin Deck is missing.
    df['Cabin Missing'] = df['Cabin Deck'].eq('Unknown').astype(int)

    return df


def load_to_sql(df: pd.DataFrame, db_path: Path):
    # Loading the Data into SQL DB
    conn = sqlite3.connect(db_path)
    df.to_sql("titanic_clean", conn, if_exists="replace", index=False)
    conn.close()
    print(f"Loaded {len(df)} rows into database: {db_path}, table: titanic_clean")



if __name__ == "__main__":
    df_raw = extract(RAW_PATH)
    df_clean = transform(df_raw)
    load_to_sql(df_clean, DB_PATH)
    # Saving to Pinecode (as vector embeddings)
    embed_and_upsert_openai_pinecone(df_clean)
