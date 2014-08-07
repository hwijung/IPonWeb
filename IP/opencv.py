import cv2

def face_detect(path,outpath):
    rects, img = _detect(path)
    _box(rects, img, outpath)
    return img

def get_size(path):
    img = cv2.imread(path)
    height, width, depth = img.shape
    return height, width

def _detect(path):
    img = cv2.imread(path)
    cascade = cv2.CascadeClassifier("/contents/opencv/haarcascade_frontalface_alt.xml")
    rects = cascade.detectMultiScale(img, 1.3, 4, cv2.cv.CV_HAAR_SCALE_IMAGE, (20,20))

    if len(rects) == 0:
        return [], img
    rects[:, 2:] += rects[:, :2]
    return rects, img

def _box(rects, img, outpath):
    for x1, y1, x2, y2 in rects:
        cv2.rectangle(img, (x1, y1), (x2, y2), (127, 255, 0), 2)
    cv2.imwrite(outpath, img);

