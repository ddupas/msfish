import { deletedup } from '../deletedup.mjs';
import { exit } from 'node:process';

function log(l) {
  console.log('test deletedup: ' + l);
}

try {
  await deletedup();
}
catch (e) {
  log('delete duplicates failed ' + e);
  exit(1);
}
log('delete duplicates succeded'); 