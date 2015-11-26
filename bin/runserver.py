
from hicbrowser import app
import sys
if len(sys.argv) > 2:
    port = sys.argv[3]
else:
    port = None
app.run(host='0.0.0.0', debug=False, port=port)