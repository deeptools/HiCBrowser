# HiCBrowser : A simple web browser to visualize Hi-C and other genomic tracks
Fidel Ramirez,José Villaveces,Vivek Bhardwaj  


## Installation

You can install HiCBrowser using pip :

```r
pip install git+git//github.com/maxplanck-ie/HiCBrowse@master
```

You can also download/clone this GitHub repository and run the setup.py script inside :


```r
cd HiCBrowser
python setup.py install -f
```


## Usage

### Install HiCExplorer

HiCBrowser works using [**HiCExplorer**](http://hicexplorer.readthedocs.io/en/latest/) in the background. Thus, you need to [install HiCExplorer](http://hicexplorer.readthedocs.io/en/latest/content/installation.html) first.

Set your $PYTHONPATH bash variable to directory containing HiCExplorer and HiCBrowser, as follows :


```python
# ON COMMAND LINE
export PYTHONPATH=/path/to/HiCExplorer:/path/to/HiCBrowser
```

### Prepare files

HiCBrowser needs three config files.

+ **region tracks** : To visualize all genomic tracks for given regions. (eg. gene_tracks.ini)
+ **gene tracks** : To visualize TADs near given gene. (eg. region_tracks.ini)
+ **browser config file** : To providing information about directories to save images and the two tracks above. (eg. browserConfig.ini)

We have provided example for each of these files with the package, as shown above.

To save the images for genes and regions, create two folders. eg. *genes_images* and *regions_images* and provide the path to these folders in the browserConfig.ini files (see sample file in the package).

### Run

To run the browser, simply run **runBrowser** command, as shown below.

        

```r
# -c = browser config file
# -p = localhost port to run the server
# -np = number of processors

runBrowser -c browserConfig.ini -p 8888 -np 10 
```

## Help

Contact our googleGroup **hicexplorer@googlegroup.com** for further help with HiCBrowser or HiCExplorer.
