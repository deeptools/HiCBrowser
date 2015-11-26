
from hicbrowser import app
import sys
if len(sys.argv) > 1:
    port = sys.argv[2]
else:
    port = None
app.run(host='0.0.0.0', debug=False, port=port)