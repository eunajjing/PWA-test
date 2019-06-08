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

// CODELAB: Update cache names any time any of the cached files change.
// const CACHE_NAME = "static-cache-v1";
// // 어떤 캐시에 저장할 것인지

// // CODELAB: Add list of files to cache here.
// const FILES_TO_CACHE = ["/offline.html"];
// // 어떤 것을 캐시할 것인지
// // 오프라인에서 뭘 쓸 것인지

// 리액트는 번들만 캐싱하면 된다
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/scripts/app.js",
  "/scripts/install.js",
  "/scripts/luxon-1.11.4.js",
  "/styles/inline.css",
  "/images/add.svg",
  "/images/clear-day.svg",
  "/images/clear-night.svg",
  "/images/cloudy.svg",
  "/images/fog.svg",
  "/images/hail.svg",
  "/images/install.svg",
  "/images/partly-cloudy-day.svg",
  "/images/partly-cloudy-night.svg",
  "/images/rain.svg",
  "/images/refresh.svg",
  "/images/sleet.svg",
  "/images/snow.svg",
  "/images/thunderstorm.svg",
  "/images/tornado.svg",
  "/images/wind.svg"
];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";
// 모든 데이터를 다 캐싱하겠다

self.addEventListener("install", evt => {
  // 설치하는 것
  // 동작할 준비가 된
  console.log("[ServiceWorker] Install");
  // CODELAB: Precache static resources here.
  // 오프라인 상에서 쓸 수 있는지 캐싱
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("[ServiceWorker] Pre-caching offline page");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", evt => {
  // 백그라운드에서 계속 돌고 있는
  console.log("[ServiceWorker] Activate");
  // CODELAB: Remove previous cached data from disk.
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            // 캐시의 키가 변했을 때 삭제
            console.log("[ServiceWorker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", evt => {
  // html 리퀘스트를 가로챌 때 사용
  console.log("[ServiceWorker] Fetch", evt.request.url);
  // CODELAB: Add fetch event handler here.
  // if (evt.request.mode !== "navigate") {
  //   // 페이지 이동의 경우 안하고
  //   // Not a page navigation, bail.
  //   return;
  // }
  // evt.respondWith(
  //   // 리퀘스트 가로 채서 캐시가 있으면 캐시를 열어서 오프라인에 있는 것을 반환한다
  //   fetch(evt.request).catch(() => {
  //     return caches.open(CACHE_NAME).then(cache => {
  //       return cache.match("offline.html");
  //     });
  //   })
  // );

  if (evt.request.url.includes("/forecast/")) {
    console.log("[Service Worker] Fetch (data)", evt.request.url);
    evt.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(evt.request)
          .then(response => {
            // If the response was good, clone it and store it in the cache.
            if (response.status === 200) {
              cache.put(evt.request.url, response.clone());
            }
            return response;
          })
          .catch(err => {
            // Network request failed, try to get it from the cache.
            return cache.match(evt.request);
          });
      })
    );
    return;
  }
  evt.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(evt.request).then(response => {
        return response || fetch(evt.request);
      });
    })
  );
});
