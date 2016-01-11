'use strict';

// Internal
import {collectInclClones} from './utils';

export function up (node, callback, child) {
  let nodesInclClones = collectInclClones(node);

  for (let i = nodesInclClones.length; i--;) {
    if (child) {
      callback(nodesInclClones[i], child);
    }

    for (let j = nodesInclClones[i].parents.length; j--;) {
      up(nodesInclClones[i].parents[j], callback, nodesInclClones[i]);
    }
  }
}

export function down (node, callback) {
  let nodesInclClones = collectInclClones(node);

  for (let i = nodesInclClones.length; i--;) {
    callback(nodesInclClones[i]);

    for (let j = nodesInclClones[i].childRefs.length; j--;) {
      down(nodesInclClones[i].childRefs[j], callback);
    }
  }
}

export function upAndDown (node, callbackUp, callbackDown) {
  if (callbackDown) {
    up(node, callbackUp);
    down(node, callbackDown);
  } else {
    up(node, callbackUp);
    down(node, callbackUp);
  }
}
