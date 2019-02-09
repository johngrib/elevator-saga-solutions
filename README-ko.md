# elevator-saga-solutions

elevator saga 터미널 구동기

[English](README.md) | 한국어


## 사용 방법

```sh
./run.js [stage] [file_name]
```

* 엘리베이터 작동 코드 js 파일을 `solutions` 디렉토리에 복사해 넣습니다.
    * 예를 들어, `test.js` 라는 파일을 만들어 `solutions` 에 넣었다고 합시다.
* 다음 명령을 실행하면 됩니다.

```sh
# challenge 2 를 웹 브라우저로 띄우고 test.js 파일을 적용해 엘리베이터를 움직입니다.
./run.js 2 ./solutions/test.js

# challenge 2 를 웹 브라우저로 띄우고 test.js 파일을 적용해 엘리베이터를 움직입니다.(짧은 명령)
./run.js 2 test

# challenge 16 을 웹 브라우저로 띄우고 test.js 파일을 적용해 엘리베이터를 움직입니다.
./run.js 16 ./solutions/test.js

# challenge 16 을 웹 브라우저로 띄우고 test.js 파일을 적용해 엘리베이터를 움직입니다.(짧은 명령)
./run.js 16 test
```

## 설치

* [Homebrew](https://brew.sh/ ) 에 의존성이 있습니다.

1. [brew 설치](https://brew.sh/ )
1. `git clone https://github.com/johngrib/elevator-saga-solutions.git`
3. `cd elevator-saga-solutions`
4. `npm install`

