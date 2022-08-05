# Dummy JSON data

Run the follwing command to fetch the dummy JSON data.

_python getdata.py_ 

The structure of the dummy file is:
- Compare: The comparison being made
	- Groups: T2D and NGT
	- Views: basal, post (exercise), and rec(overy)
- Model: Logistic regression (for now)
- Accuracy: Classification accuracy
- Train: Array of number from each group in training set
- Test: Array of number from each group in test set
- Weights: Weights for LogisticRegression classifier
- Labels: Genes that weights correspond to

This data is for **1 training/test split**
