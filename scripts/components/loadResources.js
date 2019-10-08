import { transformArrayToObject, isArrayEmpty } from "../../utility/helpers.js";
import { imagesName, soundsName } from "../../constants/index.js";

const BACKGROUND = "background";
const AUDIO_LOADED_READY_STATE = 4;

class LoadResources {
  constructor(imagesArr, soundsArr) {
    this.imagesArr = imagesArr;
    this.soundsArr = soundsArr;
    this.loadedImages = [];
    this.loadedSounds = [];
    this.isAllLoaded = false;
    this.isLoadStarted = false;
  }

  loadSingleImage(src) {
    return new Promise((res, rej) => {
      const image = new Image();
      image.src = src;
      image.addEventListener("load", () => res(image));
    });
  }

  loadAllImages() {
    const imagesArr = this.imagesArr.map(image => this.loadSingleImage(image));
    Promise.all(imagesArr).then(
      data => (this.loadedImages = transformArrayToObject(imagesName, data))
    );
  }

  loadSingleAudio(src) {
    const audio = new Audio(src);
    audio.volume = 0.25;
    if (src.indexOf(BACKGROUND) !== -1) audio.loop = true;
    return audio;
  }

  loadAllSounds() {
    this.loadedSounds = this.soundsArr.map(item => this.loadSingleAudio(item));
  }

  initLoad() {
    if (!this.isLoadStarted) {
      this.loadAllImages();
      this.loadAllSounds();
      this.isLoadStarted = true;
    }
  }

  checkLoad() {
    this.initLoad();
    const isAllSoundsLoaded = this.loadedSounds.filter(
      item => item.readyState < AUDIO_LOADED_READY_STATE
    );

    if (isArrayEmpty(isAllSoundsLoaded))
      this.loadedSounds = transformArrayToObject(soundsName, this.loadedSounds);
  }

  load() {
    if (!Array.isArray(this.loadedImages) && !Array.isArray(this.loadedSounds))
      return (this.isAllLoaded = true);
    this.checkLoad();
    setTimeout(this.load.bind(this), 1);
  }
}

export default LoadResources;