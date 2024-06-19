<h2> Create venv: </h2>
<h3> WINDOWS </h3>
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate

<h3> MAC </h3>
python3 -m venv venv
source venv/bin/activate


<h2> Start bot: </h2>
pip install -r requirements.txt && python bot.py

<h2> Start flask auth (for Discord OAuth for website) </h2>
python auth.py

