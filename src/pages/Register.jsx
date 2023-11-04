import React, { useContext, useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, storage, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';



function Register() {
  const [err, setErr] = useState(false);
 const navigate  =  useNavigate();
 const handleSubmit = async (e) => {
  e.preventDefault();
  const displayName = e.target[0].value;
  const email = e.target[1].value;
  const password = e.target[2].value;
  const file = e.target[3].files[0];

  try {
    //Create user
    const res = await createUserWithEmailAndPassword(auth, email, password);

    //Create a unique image name
    const date = new Date().getTime();
    const storageRef = ref(storage, `${displayName + date}`);

    await uploadBytesResumable(storageRef, file).then(() => {
      getDownloadURL(storageRef).then(async (downloadURL) => {
        try {
          //Update profile
          await updateProfile(res.user, {
            displayName,
            photoURL: downloadURL,
          });
          //create user on firestore
          await setDoc(doc(db, "users", res.user.uid), {
            uid: res.user.uid,
            displayName,
            email,
            photoURL: downloadURL,
          });

          //create empty user chats on firestore
          await setDoc(doc(db, "userChats", res.user.uid), {});
          navigate("/");
        } catch (err) {
          // console.log(err);
          setErr(true);
        
        }
      });
    });
  } catch (err) {
    setErr(true);
    
  }
};
  

  return (
    <div className="formContainer">
      <div className="formWrapper">
      <span className='logo'>D-
      <span style={{color:'rgb(79 197 207)'}}>T</span>
      alks</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Display name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <input style={{ display: 'none' }} type="file" id="file" />
          <label htmlFor="file">
            {/* <img width="48" height="48" src='"../images/avatar.png"' alt="circled-user-male-skin-type-5--v1" /> */}
            <svg width="30px" height="30px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512.049993 0.016664C229.336805 0.016664 0.116651 229.116001 0.116651 511.950007c0 174.135659 86.980341 327.898971 219.842209 420.345267 26.046609-90.704856 92.104674-158.833485 181.926311-189.616977 2.416352-0.829059 4.857701-1.620622 7.303216-2.395521 1.699779-0.533264 3.387059-1.087358 5.103502-1.595626a316.654602 316.654602 0 0 1 14.056503-3.841166 338.080979 338.080979 0 0 1 11.515167-2.657988c1.491472-0.312459 3.007942-0.599922 4.507747-0.895716a340.214035 340.214035 0 0 1 13.998177-2.470512 337.372738 337.372738 0 0 1 9.57792-1.337326c1.441479-0.187476 2.874626-0.38745 4.328603-0.549928a355.545372 355.545372 0 0 1 14.031506-1.353991H538.029944c4.728551 0.354121 9.398776 0.820726 14.044005 1.353991 1.424814 0.162479 2.837131 0.358287 4.253613 0.53743a361.594584 361.594584 0 0 1 14.38146 2.116391c3.212082 0.545762 6.390835 1.137352 9.557089 1.766437 1.349824 0.266632 2.703815 0.520766 4.049473 0.799895a327.582346 327.582346 0 0 1 26.067439 6.628304c1.299831 0.38745 2.574665 0.804062 3.861997 1.208176 2.970447 0.929046 5.915896 1.883088 8.832183 2.89129 89.467517 30.866814 155.250618 98.845463 181.268065 189.275355 132.745215-92.458794 219.642234-246.163781 219.642234-420.207785-0.004166-282.834006-229.220154-511.933342-511.937509-511.933343z m0 725.443042c-133.116001 0-241.02695-107.910949-241.026949-241.02695 0-1.266502 0.07499-2.516339 0.095821-3.774508-1.312329-152.371827 141.514907-244.059888 241.168598-237.252441h0.116651c102.153365-6.96576 249.88413 89.280042 241.264419 248.230178-0.254134 0.158313-0.529098 0.27913-0.783232 0.437443-4.045307 129.570629-110.281474 233.386278-240.835308 233.386278z" fill="#D6E079" /><path d="M512.287463 357.482619c-24.325999 103.44903-170.644447 178.443432-240.910299 134.153366a243.572452 243.572452 0 0 1-0.258299-10.977737c-0.020831 1.262336-0.095821 2.512173-0.095821 3.774508 0 133.111834 107.910949 241.02695 241.026949 241.02695 130.553834 0 236.790001-103.815649 240.835308-233.386278-70.674131 43.277698-216.238511-31.512563-240.597838-134.590809z" fill="#FCE9EA" /><path d="M566.051295 728.834266zM552.078115 726.934514c1.424814 0.162479 2.837131 0.358287 4.253613 0.53743-1.420648-0.179143-2.832964-0.374951-4.253613-0.53743zM439.867726 732.192162c1.491472-0.312459 3.007942-0.599922 4.507746-0.895716-1.499805 0.295795-3.016274 0.583257-4.507746 0.895716zM610.383023 738.782971c1.299831 0.38745 2.574665 0.804062 3.861997 1.208176-1.287332-0.404114-2.566333-0.820726-3.861997-1.208176zM453.515948 729.613332zM425.382112 735.604218zM467.951569 727.484442c1.441479-0.187476 2.874626-0.38745 4.328603-0.549928-1.453977 0.162479-2.887124 0.362453-4.328603 0.549928zM580.266111 731.354772c1.349824 0.266632 2.703815 0.520766 4.049473 0.799895-1.341492-0.27913-2.699648-0.533264-4.049473-0.799895zM512.049993 823.834397c-0.995704 0-1.978909-0.05416-2.96628-0.074991l2.96628 2.078896 2.957949-2.078896c-0.983205 0.024997-1.966411 0.07499-2.957949 0.074991z" fill="#A0D9F6" /><path d="M623.077203 742.882437c0.81656 0.27913 1.633121 0.574925 2.445515 0.862388a119.234475 119.234475 0 0 1-10.456971 22.092957c17.285249 26.21742 12.985809 141.631558-12.910819 123.417263l-45.110793-31.650046-44.994142-31.766697-45.110792 31.766697-44.994142 31.650046c-25.896628 18.214295-30.196068-97.199844-12.910819-123.413097a119.651087 119.651087 0 0 1-10.423642-22.005468c1.091525-0.38745 2.178883-0.783231 3.274573-1.154017-89.825804 30.783492-155.879703 98.907955-181.926311 189.616977 82.84338 57.646661 183.513605 91.467257 292.091133 91.467257 108.665018 0 209.410233-33.874756 292.291108-91.604739-26.017446-90.434058-91.800547-158.412707-181.263898-189.279521zM409.192553 740.282776c1.699779-0.53743 3.387059-1.087358 5.103502-1.595626-1.716443 0.508267-3.40789 1.062362-5.103502 1.595626z" fill="#A0D9F6" /><path d="M409.038406 765.841948c3.449551-5.228486 7.744825-6.932431 12.910819-3.299571l44.994142 31.650046 42.144512 29.571149c0.987371 0.020831 1.970577 0.07499 2.966281 0.074991 0.991538 0 1.974743-0.049993 2.957948-0.074991l42.036193-29.571149 45.110793-31.650046c5.161828-3.63286 9.461268-1.928916 12.910819 3.295405a119.109491 119.109491 0 0 0 10.456972-22.092957c-0.812394-0.287463-1.628955-0.583257-2.445515-0.862388-2.916287-1.008202-5.861737-1.966411-8.832184-2.89129-1.287332-0.404114-2.562166-0.820726-3.861997-1.208176a329.382112 329.382112 0 0 0-26.067439-6.628304c-1.341492-0.27913-2.695482-0.533264-4.049473-0.799895-3.166254-0.624919-6.345007-1.220674-9.557089-1.766437a349.579482 349.579482 0 0 0-14.38146-2.116391c-1.416482-0.179143-2.828798-0.374951-4.253613-0.53743a356.182789 356.182789 0 0 0-14.044005-1.353991H486.311678a356.311939 356.311939 0 0 0-14.031506 1.353991c-1.449811 0.162479-2.882958 0.362453-4.328603 0.549928a353.141518 353.141518 0 0 0-14.435621 2.124723 354.20388 354.20388 0 0 0-9.140476 1.683115c-1.499805 0.295795-3.016274 0.583257-4.507746 0.895716-3.874496 0.820726-7.711496 1.708111-11.515168 2.657988-0.991538 0.249967-1.983075 0.499935-2.970446 0.758234a323.374561 323.374561 0 0 0-11.086057 3.082932c-1.716443 0.508267-3.403723 1.058196-5.103502 1.595626a340.164041 340.164041 0 0 0-7.303216 2.395521c-1.095691 0.374951-2.183049 0.770733-3.274573 1.154017a119.017836 119.017836 0 0 0 10.423642 22.009634z" fill="#FEFEFE" /><path d="M602.154928 762.542377l-45.110793 31.650046-42.036193 29.571149-2.957949 2.078896 44.994142 31.766697 45.110793 31.650046c25.896628 18.214295 30.196068-97.199844 12.910819-123.417263-3.445385-5.228486-7.748991-6.932431-12.910819-3.299571zM466.939201 794.192423l-44.994142-31.650046c-5.161828-3.63286-9.461268-1.928916-12.910819 3.299571-17.285249 26.213253-12.985809 141.627392 12.910819 123.413097l44.994142-31.650046 45.110792-31.766697-2.96628-2.078896-42.144512-29.566983z" fill="#FA9689" /><path d="M512.287463 357.482619V243.405807c-99.653691-6.803281-242.480927 84.884781-241.168598 237.252441 0.029163 3.637026 0.062492 7.274053 0.258299 10.977737 70.265851 44.2859 216.580133-30.704335 240.910299-134.153366z" fill="#FECF77" /><path d="M512.287463 357.482619c24.359328 103.078245 169.923708 177.868507 240.597838 134.590809 0.2583-0.158313 0.533264-0.27913 0.783232-0.437443 8.619711-158.954303-139.115219-255.200104-241.264419-248.230178h-0.116651v114.076812z" fill="#F7B970" /></svg>
            <span>Add an Avatar</span>
          </label>
          <button>Sign up</button>
          {err && <span>Something went wrong</span>}
        </form>
        <p>You have an account? <Link to='/login'>Login</Link></p>
      </div>
    </div>
  );
}

export default Register;
