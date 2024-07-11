import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

#import deepface  # Your deepface code goes here

from deepface import DeepFace

DeepFace.stream("database")