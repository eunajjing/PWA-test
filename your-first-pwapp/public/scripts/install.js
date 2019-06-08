/*
 * @license
 * Your First PWA Codelab (https://g.co/codelabs/pwa)
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License
 */
"use strict";

let deferredInstallPrompt = null;
const installButton = document.getElementById("butInstall");
installButton.addEventListener("click", installPWA);

// CODELAB: Add event listener for beforeinstallprompt event
window.addEventListener("beforeinstallprompt", saveBeforeInstallPromptEvent);
// 배너 뜨기 전에 할 동작을 인자로 넣어준다.

/**
 * Event handler for beforeinstallprompt event.
 *   Saves the event & shows install button.
 *
 * @param {Event} evt
 */
function saveBeforeInstallPromptEvent(evt) {
  // CODELAB: Add code to save event & show the install button.
  deferredInstallPrompt = evt;
  installButton.removeAttribute("hidden");
  // 감췄던 버튼 보이게 하는 것
}

/**
 * Event handler for butInstall - Does the PWA installation.
 *
 * @param {Event} evt
 */
function installPWA(evt) {
  // CODELAB: Add code show install prompt & hide the install button.
  deferredInstallPrompt.prompt();
  // Hide the install button, it can't be called twice.
  evt.srcElement.setAttribute("hidden", true);
  // 실제 프롬프트 보이게 하는 부분

  deferredInstallPrompt.userChoice.then(choice => {
    // 유저가 이미 선택했다면 다시는 보이지 않도록 처리
    // 유저의 선택을 저장
    if (choice.outcome === "accepted") {
      console.log("User accepted the A2HS prompt", choice);
    } else {
      console.log("User dismissed the A2HS prompt", choice);
    }
    deferredInstallPrompt = null;
  });
}

// CODELAB: Add event listener for appinstalled event
window.addEventListener("appinstalled", logAppInstalled);

/**
 * Event handler for appinstalled event.
 *   Log the installation to analytics or save the event somehow.
 *
 * @param {Event} evt
 */
function logAppInstalled(evt) {
  // CODELAB: Add code to log the event
  console.log("Weather App was installed.", evt);
  // 승인을 했으면 노출시킴
}
