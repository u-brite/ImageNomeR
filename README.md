# ImageNomeR
Image/Genome/Transcriptome Explorer

The purpose of ImageNomeR is to facilitate efficient exploration of fMRI/omics data.

## Table of Contents

- [Background](#Background)
	- [Features](#Features)
- [Requirements](#Requirements)
	- python, pip, numpy, scikit-learn, requests, flask, jupyter notebook, pytorch (optional)
- [Installation](#Installation)
- [Data](#Data)
	- [Loading](#Loading) 
- [Usage](#Usage)
- [Components](#Components)
	- [Library](#Library) Interfaces with user code
	- [Server](#Server) Stores user analyses and sends JSON to the frontend
	- [Frontend](#Frontend) Interactive graphical analysis
- [Results](#Results)
- [Team Members](#Team-Members)

## Background

Analyzing data often requires many repetitive change-run-plot cycles. Any feature identification leads to code edits to move on to the next step. We created a simple web interface to really speed up analysis work. 

### Features

- Navigation is 100% by mouse.
- ImageNomeR is geared toward analysis of fMRI and omics data. 
- It is not a new algorithm for prediction or feature detection, but an aid in analysis.
- We currently produce have three types of interactive, interconnected charts along with annotations.
- The eventual goal is to have many types of plots and link features with subjects.

Here are two examples of ImageNomeR being used to find features in an fMRI (top) and RNA expression (bottom) dataset:

<img src='https://github.com/u-brite/ImageNomeR/blob/main/results/analyze_fMRI_rest_80splits_LR_WFmult_nosparse1.png?raw=1' width='300px'><img src='https://github.com/u-brite/ImageNomeR/blob/main/results/analyze_fMRI_rest_80splits_LR_WFmult_nosparse2.png?raw=1' width='300px'><br/>
<img src='https://github.com/u-brite/ImageNomeR/blob/main/results/analyze_Omics_T2DvsNGT_post_80splits_LR_WCountsMult1.png?raw=1' width='300px'><img src='https://github.com/u-brite/ImageNomeR/blob/main/results/analyze_Omics_T2DvsNGT_post_80splits_LR_WCountsMult2.png?raw=1' width='300px'><br/>

## Requirements

You should have the following software installed to use ImageNomeR: python, pip, numpy, scikit-learn, requests, flask, jupyter notebook, and pytorch (optional).

## Installation

Currently the only way to install is via git. Run this command:

```
git clone https://github.com/u-brite/ImgeNomeR.git
```

We are working on a distributable pip package. You can run 

```
pip install -e .
```

in the ImageNomeR directory to install the library component, but this will not install the server or web interface.

## Data

We used the following two datasets:

- https://openneuro.org/datasets/ds004144/versions/1.0.1 Fibromyalgia 2-task fMRI, 2 groups (17.9 GB)
	- **This dataset was used for fMRI.**
	- It contains lots of clinical and demographic data (no omics).
- https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE202295 Exercise, mRNA, type 2 diabetes (4 MB)
	- **This datset was used for omics.**
	- mRNA counts data from muscle biopsy and demographic data (no imaging).

For fMRI, we generated functional connectivity (FC) based on the Power atlas.

- https://github.com/brainspaces/power264

You can see an example of the ROIs being used to extract signal at a given timepoint.

<img src='https://github.com/u-brite/ImageNomeR/blob/main/images/power_fMRI_extraction.png?raw=1' width='400px'><br/>

### Loading

To load the data needed to run experiments, you must edit the _getdata.py_ script located in the data/ directory. Uncomment lines with the files you wish to bring in. Then, run the script:

```
cd data
python getdata.py
```

## Usage

Once you have loaded the data, navigate back to the top ImageNomeR direction, and start the server:

```
sudo python src/flask_backend/flask_backend.py
```

Navigate to http://localhost/ (note, no "s"). If the server is running but there are no analyses, you will see a screen like the following:

<img src='https://github.com/u-brite/ImageNomeR/blob/main/results/EmptyFrontPage.png?raw=1' width='400px'><br/>

Experiments are found in Jupyter notebooks. There are 4 experiments you can try:

- notebooks/fmri/fmri4LibWorkout.ipynb
- notebooks/fmri/fmri6WeighFeatCorrExperiments.ipynb
- notebooks/fmri/fmri7MLPExperiments.ipynb (requires pytorch, preferably with GPU acceleration)
- notebooks/omics/genecount2WandWFMultImageNomeR.ipynb

If server is running, and you executed one or more experiments successfully, the page at http://localhost/ should now contain analyses:

<img src='https://github.com/u-brite/ImageNomeR/blob/main/results/FrontPage.png?raw=1' width='400px'><br/>

## Components

### Library

The library formats user data into JSON and sends it to the server. The following line imports components from the ImageNomeR library:

```
from imagenomer import Analysis, JsonData, JsonSubjects, JsonFCMetadata
```

Please take a look at the code for details on how to generate acceptable JSON.

### Server

This is a basic Flask server that coordinates communication between the web browser and the user's python code (which presumably generated results they want to examine). It contains the following endpoints:

- / - Main page, in templates/index.html
- /analyze - Analysis page, in templates/analyze.html
- /post - URL to push data from user code
- /data - URL for browser to send async requests to server
- /clear - Not implemented yet, to be used for reducing memory load by removing old analyses

The static/ directory contains js and css files for the frontend.

### Frontend

A simple web UI, using only the fetch and canvas APIs. Interoperability with the library and server requires paying attention to the JSON format. The front end is not yet able to communicate back to user code via the library.

## Results

### fMRI-based diagnosis of Fibromyalgia

We attemped classification of normal controls versus female fibromyalgia sufferers with resting state and task (epr) functional connectivity from fMRI data, using Logistic Regression and MLP models. The results are as follows (averaged over 40 train/test splits):

|   |Accuracy|
|---|--------|
|LR |0.64&#xB1;0.09|
|MLP|0.51&#xB1;0.10|
|Sparse MLP|0.56&#xB1;0.11|

The Logistic Regression model was superior to both MLP models at the p < 1e-4 and p < 6e-4 significance levels.

We identified several consistently prominent connections:

- 'Temporal\_Inf\_L (aal)' to 'Fusiform\_L (aal)' (UNK-UNK)
- 'Cerebelum\_Crus1\_R (aal)' to 'Cerebelum\_Crus2\_R (aal)' (DMN-UNK)
- 'Insula\_R (aal)' to 'Cerebelum\_Crus1\_R (aal)' (UNK-UNK)

Additionally, the Default Mode Network (DMN) and Uncertain (UNK) network regions were greatly over-represented in the top few connections (20 total regions in the figure below).

<img src='https://github.com/u-brite/ImageNomeR/blob/main/results/analyze_fMRI_rest_top10_BFNs_100splits.png?raw=1' width='200px'><br/>

### Vastus lateralis-based diagnosis of type 2 diabetes

We also attempted classification of normal glucose tolerant versus type 2 diabetic men, again with a Logistic Regression. Most subjects had 3 timepoints: basal, post, and recovery. The results are as follows (averaged over 80 random train/test splits):

|   |basal|post|recovery|
|---|-----|----|--------|
|LR |0.52&#xB1;0.16|0.60&#xB1;0.16|0.57&#xB1;0.16|

We found a significant difference (p < 5e-4) between basal and post, but not a significant difference (p < 0.1) between post and recovery.

The following gene products appeared prominently in top features:

- NEB
- TTN
- MT-CO1

Two of these are muscle proteins, and a third is heavily involved in metabolism (also implicated in many diseases).

## Team Members

Anton Orlichenko | aorlichenko@tulane.edu | Team Leader<br/>
Jack Freeman | jackwfreeman@yahoo.com | Team Co-leader<br/>
Grant Daly | daly@southalabama.edu <br/>
Justin Li<br/>
Jie Yuan
