import json
import boto3
import psycopg2
from botocore.exceptions import ClientError

ssm_client = boto3.client('ssm')

def get_parameter(parameter_name):
    try:
        response = ssm_client.get_parameter(Name=parameter_name, WithDecryption=True)
        return response['Parameter']['Value']
    except ClientError as e:
        raise Exception(f"Failed to retrieve parameter '{parameter_name}': {e}")

def handler(event, context):
    db_host = get_parameter('DBHost')
    db_name = get_parameter('DBName')
    db_user = get_parameter('DBUser')
    db_password = get_parameter('DBPassword')

    try:
        conn = psycopg2.connect(
            host=db_host,
            database=db_name,
            user=db_user,
            password=db_password
        )
        cursor = conn.cursor()

        create_table_query = '''
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50),
                email VARCHAR(100)
            )
        '''

        cursor.execute(create_table_query)
        conn.commit()

        return {
            'statusCode': 200,
            'body': json.dumps('Table created successfully!')
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error: {str(e)}')
        }

    finally:
        if conn:
            conn.close()
