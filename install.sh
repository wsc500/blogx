pip install django
pip install markdown2
pip install mysqlclient
pip install django_compressor
python manage.py makemigrations
python manage.py migrate

python manage.py collectstatic
python manage.py compress --force
