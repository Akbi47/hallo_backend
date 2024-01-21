import { Module } from '@nestjs/common';
import { FirebaseController } from './firebase.controller';
import { FirebaseService } from './firebase.service';
import * as admin from 'firebase-admin';

@Module({
  controllers: [FirebaseController],
  providers: [FirebaseService],
})
export class FirebaseModule {
  constructor() {
    const { serviceAccount } = require('../../configs/firebase.config');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}
