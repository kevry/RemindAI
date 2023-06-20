from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import tensorflow as tf 
import numpy as np
import base64
import cv2
import pyaes

# load in tensorflow model
# rai_model predicts whether the user in the frame is sitting or standing (binary classifier)
rai_model = tf.keras.models.load_model('model_resnet1')


# set crypto AES alogirthm
secretkey = "testkevry10121416192012345678910".encode('utf-8')
aes = pyaes.AESModeOfOperationCTR(secretkey)

# load flask api
app = Flask(__name__)

def RemindAIPredict(image, confidence_prediction = 0.60, DEBUG = False):
    """ read in image and run rai_model inference for prediction """
    prob_prediction = rai_model.predict(image)

    # print out probability distribution for debugging model results
    if DEBUG:
        print(prob_prediction)

    # prob_prediction[0] = probability distribution list
    # use argmax to find highest probability from Remind A.I. model
    index = np.argmax(prob_prediction[0])

    # highest probability should be > 0.6 for confident prediction
    if prob_prediction[0][index] > confidence_prediction:
        # if true, return index of highest probability
        return index
    else:
        # return -1 if prediction is not greater than pre-defined confidence prediction
        return -1


@app.route("/", methods=["POST"])
@cross_origin()
def post_img_class():
    """ POST in server. This function reads in a image from Remind A.I. frontend, converts base64 to tensor
    then uses custom CNN to predict if a person in frame is sitting or standing """

    # User screenshot in base64 converting to tensor 224x224x3
    encrypteddata = request.get_json()['payload']['image']['imageBytes']

    # print(encrypteddata[:10])
    # imageByte = aes.decrypt(encrypteddata)
    # print(imageByte[:10])
    imageByte = encrypteddata

    nparr = np.frombuffer(base64.b64decode(imageByte), np.uint8)
    # print(nparr.shape)
    img2 = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    # print(img2)

    # cv2.imwrite("test.png", img2)

    # pre-defined width and height of each frame
    dsize = (224, 224) # (Width, height)
    img = cv2.resize(img2, dsize)

    # Convert img to numpy.array()
    # Call RemindAIPredict to run image classifier
    img = np.array([img])
    pred = RemindAIPredict(img)

    #pred = 1

    # Return string encoding
    # 0) Sitting
    # 1) Standing
    # Otherwise) Undetermined
    result = None
    if pred == 0:
        result = "Sitting"
    elif pred == 1:
        result = "Standing"
    else:
        result = "Undetermined"

    return result

# Defined port and main app function
if __name__ =="__main__":
    app.run(port="5000", debug=True)