import React, { useState, useEffect } from 'react';
import styles from './index.css';
import mojs from 'mo-js';

const initialState = {
  count: 0,
  countTotal: 200,
  isClicked: false,
};


/**
 * Higher Order component
 */

const withClapAnimation = WrappedComponent => {

  const WithClapAnimation = (props) => {
    const [clapAnimationState, updateClapAnimationState] = useState({
      animationTimeline: new mojs.Timeline({})
    });

    useEffect(() => {
      const totalDuration = 300;
      const scaleButton = new mojs.Html({
        el: '#clap',
        duration: totalDuration,
        scale: { 1.3: 1 },
        easing: mojs.easing.ease.out
      });

      const countTotalAnimation = new mojs.Html({
        el: '#clapCountTotal',
        opacity: { 0: 1 },
        delay: 0.6 * totalDuration,
        y: { 0: -3 },
        duration: totalDuration,
      });

      const countAnimation = new mojs.Html({
        el: '#clapCount',
        opacity: { 0: 1 },
        y: { 0: -30 },
        duration: totalDuration,
      }).then({
        opacity: { 1: 0 },
        delay: totalDuration / 2,
        y: -80
      });

      const triangleBurst = new mojs.Burst({
        parent: '#clap',
        radius: { 50: 95 },
        count: 5,
        angle: 30,
        children: {
          shape: 'polygon',
          radius: { 6: 0 },
          stroke: 'rgba(211, 54,0,0.5)',
          strokeWidth: 2,
          angle: 210,
          delay: 30,
          speed: 0.2,
          easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
          duration: totalDuration
        }

      });


      const circleBurst = new mojs.Burst({
        parent: '#clap',
        radius: { 50: 95 },
        count: 5,
        angle: 25,
        children: {
          shape: 'circle',
          radius: { 3: 0 },
          fill: 'rgba(149, 165,166,0.5)',
          delay: 30,
          speed: 0.2,
          easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
          duration: totalDuration
        }

      });


      const clap = document.getElementById('clap');
      clap.style.transform = 'scale(1,1)';

      updateClapAnimationState((currentState) => {
        return {
          animationTimeline: currentState.animationTimeline.add([scaleButton, countTotalAnimation, countAnimation, triangleBurst, circleBurst])
        }
      });

    }, []);
    return <WrappedComponent {...props} animationTimeline={clapAnimationState.animationTimeline}></WrappedComponent>
  }

  return WithClapAnimation;
}

const MediumClap = ({ animationTimeline }) => {
  const MAXIMUM_USER_CLAP = 50;
  const [clapState, setClapState] = useState(initialState);
  const { count, countTotal, isClicked } = clapState;
  const handleClapClick = () => {
    animationTimeline.replay();
    setClapState((currentState) => {
      return {
        count: Math.min(currentState.count + 1, MAXIMUM_USER_CLAP),
        countTotal: count < MAXIMUM_USER_CLAP ? currentState.countTotal + 1 : currentState.countTotal,
        isClicked: true,

      }
    });
  }
  return <button id="clap" className={styles.clap} onClick={handleClapClick}>
    <ClapIcon isClicked={isClicked} />
    <ClapCount count={count} />
    <CountTotal countTotal={countTotal} />
  </button>
}


/**
 * implementing subcomponents
 */

const ClapIcon = ({ isClicked }) => {
  return <span>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80"
      className={`${styles.icon} ${isClicked || styles.checked}`}><g data-name="10 Clap Hand"><path d="M49.488 35.069l1.729-1.729a4.281 4.281 0 00.277-5.884 4.141 4.141 0 00-2.127-1.275l.35-.35a4.273 4.273 0 00.277-5.886 4.153 4.153 0 00-3-1.39 4.294 4.294 0 00-3.084 1.221l-.193.193a4.142 4.142 0 00-2.732-1.138 4.263 4.263 0 00-3.071 1.225l-1.991 1.991a4.192 4.192 0 00-4.068-3.214h-.006a4.153 4.153 0 00-2.949 1.225l-7.6 7.6a5.208 5.208 0 00-1.626-3.215 3.114 3.114 0 00-4.3.12l-7.2 7.2a17.147 17.147 0 00-.883 23.685 16.78 16.78 0 0016.328 5.116 17.346 17.346 0 002.289.158 16.749 16.749 0 0011.906-4.959l13.53-13.52a4.3 4.3 0 00.274-5.893 4.142 4.142 0 00-2.13-1.281zm.519-6.277a2.314 2.314 0 01-.2 3.134l-4.259 4.259-.178.178c-.029-.028-.061-.05-.09-.076a4.078 4.078 0 00-.484-.369c-.072-.047-.144-.1-.219-.139a4.259 4.259 0 00-.332-.164c-.065-.03-.127-.063-.193-.089a3.953 3.953 0 00-.559-.178l1.382-1.383.347-.345a4.552 4.552 0 00.482-.582c.061-.085.112-.174.166-.262a4.968 4.968 0 00.362-.725c.018-.049.032-.1.049-.146a4.343 4.343 0 00.235-1.714v-.009a4.244 4.244 0 00-.078-.562c-.008-.04-.019-.08-.028-.12-.023-.1-.039-.2-.069-.289l.5-.5.016-.016a2.14 2.14 0 011.585-.628 2.163 2.163 0 011.565.725zm-4.683-7.6a2.211 2.211 0 011.616-.639 2.175 2.175 0 011.569.731 2.306 2.306 0 01-.206 3.132l-2.863 2.862-.02.021-.177.178c-.025-.023-.052-.042-.076-.064-.08-.071-.16-.14-.244-.2s-.157-.113-.237-.166-.161-.109-.246-.157-.2-.1-.3-.146c-.076-.036-.15-.075-.228-.106a4.159 4.159 0 00-.538-.172h-.011l.351-.35a4.461 4.461 0 00.508-.621c.026-.037.049-.074.073-.112a4.394 4.394 0 00.307-.552c.025-.053.052-.1.075-.157A4.391 4.391 0 0044.9 24c.018-.073.026-.147.04-.22a4.7 4.7 0 00.066-.47 4.318 4.318 0 00-.006-.72c-.009-.1-.013-.2-.028-.292a4.166 4.166 0 00-.143-.611zm-32.179 36.23A14.966 14.966 0 018.772 54.1a15.152 15.152 0 01.819-20.925l7.2-7.2a1.161 1.161 0 01.818-.342 1.014 1.014 0 01.7.267 3.252 3.252 0 01.077 4.673l-6.771 6.767a1 1 0 101.414 1.414l6.764-6.763 10.519-10.519a2.164 2.164 0 011.54-.639 2.19 2.19 0 011.548 3.738L22.136 35.837a1 1 0 101.414 1.414l11.265-11.266 4.516-4.515a2.189 2.189 0 013.177.087 2.039 2.039 0 01.5 1.115c0 .027 0 .056.005.084a2.234 2.234 0 01.008.317c0 .037-.007.074-.01.111a2.528 2.528 0 01-.047.3q-.012.054-.027.108a2.545 2.545 0 01-.108.311l-.031.074a2.494 2.494 0 01-.5.717l-2.321 2.321-.546.545-.006.007v.005l-12.78 12.774a1 1 0 101.414 1.414l12.775-12.775c.041-.041.088-.07.131-.107a2.263 2.263 0 011.413-.529h.06a2.228 2.228 0 01.442.056 2.177 2.177 0 011.129.674 1.987 1.987 0 01.454.9 2.425 2.425 0 01-.662 2.231l-.2.2-4.057 4.047c-.009.009-.011.02-.02.029l-8.371 8.371a1 1 0 101.414 1.414l8.4-8.394a2.171 2.171 0 011.131-.6l.029-.008a2.118 2.118 0 01.444-.032 2.232 2.232 0 01.4.051l.042.006c.051.012.1.035.147.05a2.185 2.185 0 01.981.623 1.985 1.985 0 01.247.341 2.372 2.372 0 01-.457 2.792L30.4 54.624c-.275.275-.559.536-.85.786l-.163.132a15.59 15.59 0 01-.708.557c-.094.069-.191.135-.286.2q-.309.216-.626.416a15.533 15.533 0 01-1.345.751c-.186.092-.375.177-.565.26-.151.067-.3.136-.456.2s-.324.12-.486.179c-.188.068-.374.139-.564.2-.037.012-.075.021-.112.032-.292.09-.587.173-.885.245-.009 0-.016.009-.026.012a14.912 14.912 0 01-10.183-1.172zM36.4 54.346a14.814 14.814 0 01-7.593 4.088c.06-.038.114-.085.174-.124.322-.207.632-.435.942-.666.18-.133.366-.257.54-.4.373-.3.73-.628 1.081-.965.088-.083.185-.155.27-.24l13.53-13.53a4.436 4.436 0 00.49-.6c.05-.071.092-.144.138-.217a4.4 4.4 0 00.217-.391c.056-.114.108-.227.154-.344.029-.075.052-.152.077-.229a4.321 4.321 0 00.218-1.6v-.09a3.911 3.911 0 00-.069-.507c-.013-.067-.031-.132-.047-.2s-.033-.164-.058-.243l.493-.494a2.187 2.187 0 013.18.081 2.331 2.331 0 01-.206 3.146zM60.707 7.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM59.553 15.105l-4 2a1 1 0 00.894 1.79l4-2a1 1 0 10-.894-1.79zM49.485 12.857a1 1 0 001.372-.342l3-5a1 1 0 00-1.714-1.03l-3 5a1 1 0 00.342 1.372zM25.081 11.394a1 1 0 001.838-.788l-3-7a1 1 0 00-1.838.788zM30 12a1 1 0 001-1V5a1 1 0 00-2 0v6a1 1 0 001 1zM21.219 13.625a1 1 0 001.562-1.25l-4-5a1 1 0 00-1.562 1.25z" /></g></svg>
  </span>
}

const ClapCount = ({ count }) => {
  return <span id="clapCount" className={styles.count}>
    + {count}
  </span>
}

const CountTotal = ({ countTotal }) => {
  return <span id="clapCountTotal" className={styles.total}>
    {countTotal}
  </span>
}

// simmulating usage

const Usage = withClapAnimation(MediumClap);
export default Usage;
