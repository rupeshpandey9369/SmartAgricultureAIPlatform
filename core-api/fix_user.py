import sys

try:
	import psycopg2
except ImportError:
	sys.exit("Missing dependency: install 'psycopg2' or 'psycopg2-binary' (pip install psycopg2-binary)")


def main():
	conn = psycopg2.connect(
		'postgresql://neondb_owner:npg_kBx0rCTPboU4@ep-muddy-sunset-aou9y6m1.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
	)
	cur = conn.cursor()
	cur.execute("UPDATE users SET is_verified = TRUE WHERE phone = '+919026084997'")
	conn.commit()
	print('Rows updated:', cur.rowcount)
	cur.close()
	conn.close()


if __name__ == '__main__':
	main()