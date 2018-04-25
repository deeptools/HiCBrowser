# HiCBrowser : A simple web browser to visualize Hi-C and other genomic tracks

Fidel Ramirez, José Villaveces, Vivek Bhardwaj  

## Installation

You can install HiCBrowser using pip :

```
pip install git+https://github.com/deeptools/HiCBrowser
```

You can also download/clone this GitHub repository and run the setup.py script inside :

```
cd HiCBrowser
python setup.py install -f
```

If you have Docker installed on your computer you can also use our [Docker HiCBrowser Image](https://github.com/maxplanck-ie/docker-hicbrowser). You can start a production ready HiCBrowser instance with:

```
docker run --rm -i -t -p 80:80 bgruening/docker-hicbrowser
```

For more information about the Docker image please refer to https://github.com/maxplanck-ie/docker-hicbrowser#usage


## Usage

### Install HiCExplorer

HiCBrowser works using [**HiCExplorer**](http://hicexplorer.readthedocs.io/en/latest/) in the background. Thus, you need to [install HiCExplorer](http://hicexplorer.readthedocs.io/en/latest/content/installation.html) first.

If HiCExplorer and or HiCBrowser is not properly installed (by running setup.py) it may be required to set the $PYTHONPATH. Specially for development it is quite convenient not to install the packages:


```python
# ON COMMAND LINE
export PYTHONPATH=/path/to/HiCExplorer:/path/to/HiCBrowser
```

### Test run

The folder `example_browser` contains all data and config files to run the browser. This is _Drosophila melanogaster_ data only for chromosome X. To start the example server simply type:

```r
cd example_browser
bash run_server.sh
```

### Prepare files

HiCBrowser needs three config files.

+ **region tracks** : To visualize all genomic tracks for given regions. (eg. [gene_tracks.ini](./gene_tracks.ini))
+ **gene tracks** : To visualize TADs near given gene. (eg. [region_tracks.ini](./region_tracks.ini))
+ **browser config file** : To providing information about directories to save images and the two tracks above. (eg. [browserConfig.ini](./browserConfig.ini))

We have provided example for each of these files with the package, as shown above. For a full documentation of what types of data can be plotted in the region tracks 
and for extended examples please look at the [documentation of the plotTADs](http://hicexplorer.readthedocs.io/en/latest/content/tools/hicPlotTADs.html) 
function of [HiCExplorer](http://hicexplorer.readthedocs.io/en/latest/)  


### Run

To run the browser, simply run **runBrowser** command, as shown below.

        

```r
# --config = browser config file
# --port = localhost port to run the server

runBrowser --config browserConfig.ini --port 8888 --numProcessors 10 
```

## Help

Contact our [google Group](https://groups.google.com/forum/#!forum/deeptools) **deeptools@googlegroups.com** for further help with HiCBrowser or HiCExplorer.
