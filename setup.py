#!/usr/bin/env python

from distutils.core import setup

setup(name='ImageNomeR',
      version='0.1.0',
      description='Facilitate efficient exploration of fMRI/omics data',
      author='Anton Orlichenko',
      author_email='aorlichenko@tulane.edu',
      url='https://aorliche.github.io/ImageNomeR',
      package_dir={'':'src'},
      py_modules=['imagenomer'],
      dependencies = [
          "scipy", "requests"
          ]
     )
