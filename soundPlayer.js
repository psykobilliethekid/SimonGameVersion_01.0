function BufferLoader(urlList, callback) {
  this.context = new AudioContext();
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = [];
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    loader.context.decodeAudioData(
        request.response,
        function(buffer) {
          if (!buffer) {
            alert('error decoding file data: ' + url);
            return;
          }
          loader.bufferList[index] = buffer;
          if (++loader.loadCount == loader.urlList.length)
            loader.onload(loader.bufferList);
        }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);
};

BufferLoader.prototype.play = function(idx){
  if (idx >= this.bufferList.length || idx < 0){
    throw new Error('no sound available at that index');
  }
  var sound = this.context.createBufferSource();
  sound.buffer = this.bufferList[idx];
  sound.connect(this.context.destination);
  sound.start();
  //sound.connect(this.bufferList[idx]);

}