import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/storage';


@Injectable()
export class FileProvider {
  fileReader: FileReader;
  storageRef: firebase.storage.Reference;

  constructor() {
    this.fileReader = new FileReader();
    this.storageRef = firebase.storage().ref();
  }

  isImage(file:File) {
    if (file.type.split('/')[0] === 'image') return true;
    return false;
  }

  getDataAsURL(file:File) {
    return new Promise(resolve => {
      this.fileReader.readAsDataURL(file);
      this.fileReader.onload = (e) => {
        resolve(this.fileReader.result);
      }
    });
  }

  uploadImage(file:File, fileName:string): Promise<string> {
    return new Promise((resolve, reject) => {
      const task = this.storageRef.child(`images/${fileName}`).put(file);
      task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
          resolve(url);
        })
        .catch(error => {
          // TO DO: Replace by a logger.
          console.log(error);
          reject(error);
        });
    });
  }
}
