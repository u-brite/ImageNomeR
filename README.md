# ImageNomeR
Image/Genome/Transcriptome Explorer

## Table of Contents

- [ImageNomeR](#team-repo-template)
    - [Background](#Background)
    - [Data](#data)
    - [Usage](#usage)
        - [Installation](#installation)
        - [Requirements](#requirements) _python,numpy,scikit-learn,nilearn,pytorch,plotly,flask,fMRIPrep_
        - [Activate conda environment](#activate-conda-environment) _Not used?_
        - [Steps to run ](#steps-to-run) _Run server in your python application that has results data_
            - [Step-1](#step-1) _Some (most?) interpretation will happen client-side in Javascript with python plotly/plotly.js_
            - [Step-2](#step-2) _Save graphs or analysis data_
    - [Results](#results) _The purpose of this tool is exploration. The output could be saved graphs._
    - [Team Members](#team-members)

## Background

Analyzing data often requires many repetitive change-run-plot cycles. Additionally, any feature identification leads to code edits to identify closely aligned features or subjects. Our goal is to create a simple web interface for moving between features and subjects seamlessly without changing code. Navigation should be 100% by mouse, and the program should give annotations on features.

The program is geared toward analysis of fMRI and omics data. It is based on a real problem from research work. It is not a new algorithm for prediction or feature detection, but an aid in analysis.

The eventual goal is to have many types of plots and identifying arbitrary subsets of omics. To start, we should have some easy to accomplish goals:

- Create an interactive bar graph of features based on correlation with discriminative power (for supervised tasks)
- Create an interactive thresholded similarity matrix based on inclusion or exclusion of features (for unsupervised tasks)

Here is an example of what a screenshot of the bar graph might look like:

![bar graph example](https://github.com/u-brite/ImageNomeR/blob/main/images/bar_graph_example.png?raw=1)

The interaction will happen in javascript. We can use the python/javascript plotly (plotly.js) library as a starting point.

## Data

We have access to the following datasets:

- https://openfmri.org/dataset/ds000053/ Gambling fMRI (180 GB)
- https://openfmri.org/dataset/ds000107/ Nback task fMRI (3 GB)
- https://cgci-data.nci.nih.gov/Public/HTMCP-CC/mRNA-seq/L3/expression/BCCA/ Cancer, unsupervised (1 GB)
- https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE202295 Exercise, muscle response, diabetes 2 (4 MB)

For fMRI, we can use the Power atlas to define ROIs:

- https://github.com/brainspaces/power264

## Usage

We have to figure it out. For fMRI, the process is something like this:

1. Download
2. Pre-process (fMRIprep)
3. Check data quality
4. Convert BOLD to timeseries
5. Convert timeseries to functional connectivity
6. Perform regression
7. Calculate correlation to features
8. Send to ImageNomeR
9. Analyze with ImageNomeR

Alternatively, can use the raw BOLD images.

### Installation

Installation simply requires fetching the source code. Following are required:

- Git

To fetch source code, change in to directory of your choice and run:

```sh
git clone -b main \
    git@github.com:u-brite/team-repo-template.git
```

### Requirements

Currently works only in Linux OS. Docker versions may need to be explored later to make it useable in Mac (and
potentially Windows).

*Tools:*

- Anaconda3
    - Tested with version: 2020.02
- See above

### Activate conda environment

Change in to root directory and run the commands below:

```sh
# create conda environment. Needed only the first time.
conda env create --file configs/environment.yaml

# if you need to update existing environment
conda env update --file configs/environment.yaml

# activate conda environment
conda activate testing
```

### Steps to run

#### Step 1

```sh
python src/data_prep.py -i path/to/file.tsv -O path/to/output_directory
```

#### Step 2

```sh
python src/model.py -i path/to/parsed_file.tsv -O path/to/output_directory
```

Output from this step includes -

```directory
output_directory/
├── parsed_file.tsv               <--- used for model
├── plot.pdf- Plot to visualize data
└── columns.csv - columns before and after filtering step

```

**Note**: The is an example note with a [link](https://github.com/u-brite/team-repo-template).


## Results

## Team Members

Anton Orlichenko | aorlichenko@tulane.edu | Team Leader
Jack Freeman | jackwfreeman@yahoo.com | Team Co-leader

