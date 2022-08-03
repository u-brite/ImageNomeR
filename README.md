# ImageNomeR
Image/Genome/Transcriptome Explorer

The purpose of ImageNomeR is to facilitate efficient exploration of fMRI/omics data (supervised or unsupervised). Find relationships between features, groups of features, and how they relate to response variables. Identify sub-populations in the browser just by using your mouse.

## Table of Contents

- [Background](#Background)
- [Data](#Data)
- [Tools](#Tools)
	- python, numpy, scikit-learn, nilearn, pytorch, plotly, plotly.js, React, flask, fMRIPrep
- [Plan](#Plan)
	- [Components](#Components)
		- [Backend](#server) Sends JSON to the frontend
		- [Frontend](#frontend) User interaction and graph generation
		- [Library](#library) For interfacing with user code
	- [Milestones](#Milestones)
		- [Input](#input) Regress or cluster fMRI and counts data
		- [Communication](#communication) Move data between user code, server, and web browser
		- [Graphs](#graphs) Generate graphs in the web browser
		- [Interaction](#interaction) Navigate within graphs
- [Results](#Results)
	- [Readme](#Readme)
- [Team Members](#Team Members)

## Background

Analyzing data often requires many repetitive change-run-plot cycles. Additionally, any feature identification leads to code edits to identify closely aligned features or subjects. Our goal is to create a simple web interface for moving between features and subjects seamlessly without changing code. Navigation should be 100% by mouse, and the program should give annotations on features.

The program is geared toward analysis of fMRI and omics data. It is based on a real problem from research work. It is not a new algorithm for prediction or feature detection, but an aid in analysis.

The eventual goal is to have many types of plots and identifying arbitrary subsets of omics. To start, we should have some easy to accomplish goals:

- Create an interactive bar graph of features based on correlation with discriminative power (for supervised tasks)
- Create an interactive thresholded similarity matrix based on inclusion or exclusion of features (for unsupervised tasks)

Here is an example of what a screenshot of the bar graph might look like:

<img src='https://github.com/u-brite/ImageNomeR/blob/main/images/bar_graph_example.png?raw=1' width='300px'>
<img src='https://github.com/u-brite/ImageNomeR/blob/main/images/nilearn_conn_visualization.png?raw=1' width='300px'><br/>

The interaction will happen in javascript. We can use the python/javascript plotly (plotly.js) library as a starting point. The above plots were created with matplotlib and nilearn, respectively.

## Data

We have access to the following datasets:

- https://openneuro.org/datasets/ds004144/versions/1.0.1 Fybromialgia 2-task fMRI, 2 groups (17.9 GB)
	- **This is the preferred dataset for fMRI.**
	- It has lots of additional clinical and demographic data (no omics).
- https://openfmri.org/dataset/ds000053/ Gambling fMRI (180 GB)
- https://openfmri.org/dataset/ds000107/ Nback task fMRI (3 GB)
- https://cgci-data.nci.nih.gov/Public/HTMCP-CC/mRNA-seq/L3/expression/BCCA/ Cancer, mRNA, unsupervised (1 GB)
- https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE202295 Exercise, mRNA, type 2 diabetes (4 MB)
	- **This the the preferred dataset for omics.**
	- mRNA counts data from muscle biopsy and demographic data (no imaging).

For fMRI, we can use the Power atlas to define ROIs:

- https://github.com/brainspaces/power264

Jack and Anton will try to have all data preprocessed prior to the Hackathon.

## Tools

The majority of the work will be done in either python (server and library) or javascript (frontend). We suggest the following tools:

- python
- numpy
- scikit-learn
- nilearn
- pytorch
- matplotlib, seaborn, plotly, plotly.js (graph generation)
- React (javascript)
- flask (python server)
- fMRIPrep
	- Preprocessing takes a long time and we will try to get it done before the Hackathon

## Plan

A breakdown of the plan for the Hackathon.

### Components

ImageNomeR will consist of 3 components: server, front-end, and library.

#### 1. Server

The server will serve the web pages containing the front-end javascript. It will also store user data and communicate data to the front-end on request via JSON. We are thinking to use Flask since it is simple and python-based.

#### 2. Frontend

The frontend will be a javascript web app (React and plotly.js might be a good starting point). The graphs will be probably be canvas based. There will be two types of graphs: feature graphs and population graphs.

- Feature graphs: bar graphs as the example in [background](#background)
- Population graphs: graphs of (subsets of) populations color-coded according to presence of a feature (see below for scikit-learn MDS example)

<img src='https://github.com/u-brite/ImageNomeR/blob/main/images/mds.png?raw=1' width='300'><br/>

Moving between graphs will take place using mouse clicks on the graphs.

Additonally, we want a panel with some summary information for highlighted features.

- Distribution of feature in subjects
- Predictive power of feature
- Closely aligned (correlated) features
- Distribution of feature weight in repeated runs of the model

#### 3. Library

The user is expected to provide their own state of the art regression/classification/clustering algorithm. They communicate with the server via a python library they import into their code.

### Milestones

We should accomplish the following goals in the 2 days of the Hackathon.

#### A. Input

Generate predictions along with feature weights for fMRI and omics data. This can be linear regression, logistic regression, NN-based models, K-means, GCN, or something more advanced. We recommend using numpy, pytorch, or scikit-learn.

#### B. Communication 

To be able to transfer data between the user code generated in [Input](#input) above, the server, and the front-end web page. User-server communication will likely use a library and IPC, while server and frontend communication will likely use JSON.

#### C. Graphs

Generate graphs in the web browser as in the [Background](#background) section. Also generate population-level graphs and annotations.

#### D. Interaction

Clicking on bars of graphs (feature view) or nodes (subject view) navigates to an another display. There will be a dynamically populated sidebar with feature or subject info.

## Results

Deliverable will be a pip python package that includes the library, server, and client that will perform all the tasks listed above.

### Readme

The final task will be to update the README.md to reflect the deliverable.

## Team Members

Anton Orlichenko | aorlichenko@tulane.edu | Team Leader<br/>
Jack Freeman | jackwfreeman@yahoo.com | Team Co-leader<br/>
Grant Daly<br/>
Justin Li<br/>
Jie Yuan
