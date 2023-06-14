import{S as Io,i as Po,s as Vo,U as yi,y as c,z as v,A as g,V as xo,W as Ro,g as w,d as y,B as b,X as Eo,k as n,q as f,a as l,l as a,m as s,r as m,h as t,c as u,n as d,b as o,D as r,E as Lo}from"../chunks/index.17f79c6b.js";import{P as Do}from"../chunks/post_layout.62c31c75.js";import{I as $}from"../chunks/footer.e30cee6b.js";function zo(te){let p,_,k,S,h,A,R,ie,Ne,Ot,Ze,E,oe,Ht,Ge,ne,Wt,Xe,ae,U,Ye,I,se,Ct,Be,re,Ft,Je,le,P,Ke,V,ue,jt,et,fe,Nt,tt,x,me,qt,it,de,Qt,ot,pe,L,nt,D,he,Zt,at,ce,Gt,st,z,Xt,M,rt,O,ve,Yt,lt,ge,Bt,ut,we,H,ft,ye,Jt,mt,W,be,Kt,dt,_e,ei,pt,$e,C,ht,F,Ae,ti,ct,ke,ii,vt,j,Se,oi,gt,Te,ni,wt,Re,N,yt,Ee,ai,bt,q,Ue,si,_t,Ie,ri,$t,Pe,Q,At,Z,Ve,li,kt,xe,ui,St,Le,G,Tt,De,fi,Rt,ze,X,Et,Y,Me,mi,Ut,Oe,di,It,He,B,Pt,We,J,Vt,K,Ce,pi,xt,Fe,hi,Lt,je,ee,Dt,T,qe,ci,vi,Qe,gi,zt;return U=new $({props:{src:"./srauv_ocean.png",alt:"srauv"}}),P=new $({props:{src:"./mech.png",alt:"mech"}}),L=new $({props:{src:"./unity_sim.png",alt:"unity_sim"}}),M=new $({props:{src:"./49_tanks.gif",alt:"tanks"}}),H=new $({props:{src:"./auto_pilot.png",alt:"system"}}),C=new $({props:{src:"./autnomous.gif",alt:"autnomous_flying"}}),N=new $({props:{src:"./tank_driving.gif",alt:"tank_driving"}}),Q=new $({props:{src:"./reward.PNG",alt:"srauv_in_tank"}}),G=new $({props:{src:"./srauv_in_tank.png",alt:"srauv_in_tank"}}),X=new $({props:{src:"./april_tank.gif",alt:"april_tags"}}),B=new $({props:{src:"./testing1.gif",alt:"testing1"}}),J=new $({props:{src:"./testing2.gif",alt:"testing2"}}),ee=new $({props:{src:"./srauv.png",alt:"srauv"}}),{c(){p=n("h1"),_=n("a"),k=f("Navigating the Depths with RL"),S=l(),h=n("p"),A=f("Hello folks! My name is Andrew Nash, and I’ve been heavily involved in developing a software system for an autonomous subsea vehicle, the SRAUV, as part of my engineering capstone project. In this blog post, I’ll detail the work I did on the Autopilot/AI perception, navigation, and control. Strap in for an exciting journey deep beneath the waves!"),R=l(),ie=n("p"),Ne=n("code"),Ot=f("youtube: https://www.youtube.com/watch?v=wzNI8wY0UT0&ab_channel=AndrewNash"),Ze=l(),E=n("h2"),oe=n("a"),Ht=f("Introduction"),Ge=l(),ne=n("p"),Wt=f("In my capstone project, my team and I have tackled a pervasive problem in offshore oil and gas operations - consistent and reliable subsea monitoring. To address this, we’ve designed a prototype Subsea Resident Autonomous Underwater Vehicle (SRAUV). Our innovative SRAUV operates indefinitely under the sea, utilizing a dock on the seafloor that facilitates wireless charging and communication. It embarks on scheduled or on-demand inspection missions, collects vital data, and then returns to the dock to transmit this information. Through this approach, we’re ushering in a new era of advanced offshore operations, with potential upgrades such as real-time anomaly detection that promises enhanced efficiency and safety."),Xe=l(),ae=n("p"),c(U.$$.fragment),Ye=l(),I=n("h2"),se=n("a"),Ct=f("Vehicle"),Be=l(),re=n("p"),Ft=f("My exceptional teammates ensured the SRAUV’s mechanical design adhered to principles of hydrodynamics, stability, and compactness, resulting in a sleek, efficient design. Fitting within the original constraints of a 2-foot length and width, the vehicle’s overall mass is approximately 15 kg, as illustrated below. The team cleverly configured the thrusters to offer a versatile maneuverability, giving the SRAUV 5 degrees of freedom, though effectively using only 4 - excluding pitch and roll - for the project’s final demonstration."),Je=l(),le=n("p"),c(P.$$.fragment),Ke=l(),V=n("h2"),ue=n("a"),jt=f("Software Overview"),et=l(),fe=n("p"),Nt=f("The SRAUV software is a culmination of collaborative effort, using Unity 3D game engine for fast prototyping, extensive machine learning support, and engaging visual feedback. The interface is an all-in-one GUI Simulator, allowing the user to control the vehicle, visualize thruster direction feedback, and simulate various environmental conditions. All software for the project is openly available on Github."),tt=l(),x=n("h2"),me=n("a"),qt=f("Simulator"),it=l(),de=n("p"),Qt=f("We developed a Unity-based simulator that accurately mimics the mechanics of the SRAUV. This simulator applies individual thrust vectors at each thruster’s respective angle, fine-tuning its underwater movement, often referred to as “driftyness”, to reflect the real-world feedback from experienced pilots. The simulation updates in response to these thrust commands, providing new sensor data which includes the SRAUV’s position and the relative locations of assets in the environment. This helped us efficiently and accurately test our autonomous flying solutions."),ot=l(),pe=n("p"),c(L.$$.fragment),nt=l(),D=n("h2"),he=n("a"),Zt=f("Model Training"),at=l(),ce=n("p"),Gt=f("In addition to the main simulator, I created a lighter “ML Tank” for training the DRL algorithms. This environment include a significantly reduced polygon count, a necessary optimization since DRL algorithms are computationally expensive to simulate. Further speed enhancements were achieved by including multiple ML Tanks, allowing multiple agents to collect observations simultaneously, this can be seen below."),st=l(),z=n("p"),Xt=f("Screenshot of 49 ML Tanks training simultaneously within the Unity environment. "),c(M.$$.fragment),rt=l(),O=n("h2"),ve=n("a"),Yt=f("Autonomous Strategy"),lt=l(),ge=n("p"),Bt=f("As the core designer of the Autopilot, I initially considered employing Q-learning for the SRAUV’s control system. This approach was favored due to its popularity and well-documented success. However, throughout the model selection process, I found Deep Reinforcement Learning (DRL) to be the most effective at driving in the simulator. I utilized Unity ML-Agents Toolkit for DRL training within the Unity simulator, leading to rapid experimentation with the SRAUV’s Flight Computer and Vision System."),ut=l(),we=n("p"),c(H.$$.fragment),ft=l(),ye=n("p"),Jt=f("With DRL, I designed an end-to-end solution for our control system. This allowed observations to go into the model and thrust control to emerge, providing optimal control of the SRAUV through a variety of unpredictable scenarios."),mt=l(),W=n("h2"),be=n("a"),Kt=f("Model Development"),dt=l(),_e=n("p"),ei=f("For model training, I used a simplified subproblem - driving from a random X, Y, Z position to another random position as quickly as possible. I then tested various DRL solutions on these subproblems, progressively introducing complexity until the environment closely mirrored real life. This iterative approach allowed for significant improvement during model development."),pt=l(),$e=n("p"),c(C.$$.fragment),ht=l(),F=n("h3"),Ae=n("a"),ti=f("Model Selection"),ct=l(),ke=n("p"),ii=f("For the SRAUV control system, I considered both discrete and continuous action spaces. While a continuous action space implies real numbers for the DRL model output, a discrete one implies a fixed set of categories. I experimentally found discrete to be more effective during training. I benchmarked the Soft Actor-Critic (SAC) model against a Proximal Policy Optimization (PPO). SAC took a considerable time to train and often failed to reach the goal consistently. On the other hand, PPO found the optimal driving strategy faster and more effectively, which led to its selection for further development."),vt=l(),j=n("h3"),Se=n("a"),oi=f("Reward Structure"),gt=l(),Te=n("p"),ni=f("The reward structure found to best solve the easy environment was relatively straightforward, consisting of three different rewards. The first reward was assigned as +1 when the agent arrived within a predefined tolerance of its goal waypoint. The second reward was the negative inverse of maximum time steps -0.002, this small negative reward assigned every timestep encouraged the model to drive to the goal as fast as possible. Finally, the third reward sets the overall reward to -1 if the agent collides with anything, this also resets the run for increased training speed."),wt=l(),Re=n("p"),c(N.$$.fragment),yt=l(),Ee=n("p"),ai=f("In further iterations of the training environment, I found that the agent would sometimes overshoot its goal position and accidentally crash into a wall, to help mitigate this problem a stacking negative reward was assigned whenever the agent exceeded 0.3 m/s velocity in any axis of movement. This resulted in reduced crashing and taught the model to operate at a reduced speed when nearing its goal position."),bt=l(),q=n("h3"),Ue=n("a"),si=f("Curriculum Learning"),_t=l(),Ie=n("p"),ri=f("Since the PPO algorithm struggled to converge when tolerances of less than 40cm were used in training, I utilized curriculum learning to overcome this challenge. This technique allowed me to progressively decrease the tolerance required to reach the goal waypoint during training, significantly enhancing the model’s performance."),$t=l(),Pe=n("p"),c(Q.$$.fragment),At=l(),Z=n("h3"),Ve=n("a"),li=f("Localization"),kt=l(),xe=n("p"),ui=f("After our initial approach for localization, which relied on a combination of a pressure sensor, time-of-flight (TOF) sensors, and an inertial-measurement-unit (IMU), failed to meet expectations, my team and I were forced to quickly pivot. Due to issues ranging from faulty TOF sensors, an unsteady IMU, and a malfunctioning depth sensor, we had to reimagine our solution, leading us to the exploration of a computer vision-based approach. Utilizing AprilTags, similar to simple QR codes, we established a localization system that successfully tracked the position and rotation of the SRAUV relative to the tank. We installed a grid of these AprilTags on the tank floor, ensuring the bottom camera of the SRAUV was able to constantly locate a tag, significantly improving our vehicle’s spatial awareness. Impressively, this solution not only worked exceedingly well during testing, achieving an accuracy of about +-5 cm in position and +-5 degrees in heading, but it was also considerably more cost-effective than our initial sensor plan."),St=l(),Le=n("p"),c(G.$$.fragment),Tt=l(),De=n("p"),fi=f("The AprilTags detection in the ML Tank was another area I optimized. Running the vision recognition on all 49 tanks in a single environment would have been computationally prohibitive. To address this, I added a camera with matching intrinsic parameters and position to the SRAUV’s bottom pi cam in the simulator. This allowed me to check if the AprilTag was in the camera’s frame during each timestep, providing the agent with the most recently known position & velocity estimate, simulating the noisy conditions it would face in the real world."),Rt=l(),ze=n("p"),c(X.$$.fragment),Et=l(),Y=n("h2"),Me=n("a"),mi=f("Real World Testing"),Ut=l(),Oe=n("p"),di=f("Below you can see some videos of real world testing the SRAUV in a tank at Memorial University."),It=l(),He=n("p"),c(B.$$.fragment),Pt=l(),We=n("p"),c(J.$$.fragment),Vt=l(),K=n("h2"),Ce=n("a"),pi=f("Conclusion"),xt=l(),Fe=n("p"),hi=f("Wrapping up, I am incredibly proud of the progress and achievements made by my team and myself throughout our capstone project. We successfully designed, implemented, and tested a neural network-based autopilot for our Subsea Resident AUV (SRAUV) prototype. This enabled the SRAUV to perform autonomous missions, including navigating a prescribed route and redocking, a significant milestone for us. Even though we faced setbacks, such as hardware failures limiting the testing of an improved autopilot model, these challenges only fueled our drive to innovate. Our commitment paid off, winning us first place in all capstone award categories. We believe our work has set a strong foundation for future developments in autonomous subsea navigation."),Lt=l(),je=n("p"),c(ee.$$.fragment),Dt=l(),T=n("p"),qe=n("code"),ci=f("youtube: https://www.youtube.com/watch?v=v3Z9sVuU5DQ&ab_channel=AndrewNash"),vi=f(`\\
`),Qe=n("code"),gi=f("youtube: https://www.youtube.com/watch?v=UXqgjFvW4HE&t=9s&ab_channel=AndrewNash"),this.h()},l(e){p=a(e,"H1",{id:!0});var i=s(p);_=a(i,"A",{href:!0});var bi=s(_);k=m(bi,"Navigating the Depths with RL"),bi.forEach(t),i.forEach(t),S=u(e),h=a(e,"P",{});var _i=s(h);A=m(_i,"Hello folks! My name is Andrew Nash, and I’ve been heavily involved in developing a software system for an autonomous subsea vehicle, the SRAUV, as part of my engineering capstone project. In this blog post, I’ll detail the work I did on the Autopilot/AI perception, navigation, and control. Strap in for an exciting journey deep beneath the waves!"),_i.forEach(t),R=u(e),ie=a(e,"P",{});var $i=s(ie);Ne=a($i,"CODE",{});var Ai=s(Ne);Ot=m(Ai,"youtube: https://www.youtube.com/watch?v=wzNI8wY0UT0&ab_channel=AndrewNash"),Ai.forEach(t),$i.forEach(t),Ze=u(e),E=a(e,"H2",{id:!0});var ki=s(E);oe=a(ki,"A",{href:!0});var Si=s(oe);Ht=m(Si,"Introduction"),Si.forEach(t),ki.forEach(t),Ge=u(e),ne=a(e,"P",{});var Ti=s(ne);Wt=m(Ti,"In my capstone project, my team and I have tackled a pervasive problem in offshore oil and gas operations - consistent and reliable subsea monitoring. To address this, we’ve designed a prototype Subsea Resident Autonomous Underwater Vehicle (SRAUV). Our innovative SRAUV operates indefinitely under the sea, utilizing a dock on the seafloor that facilitates wireless charging and communication. It embarks on scheduled or on-demand inspection missions, collects vital data, and then returns to the dock to transmit this information. Through this approach, we’re ushering in a new era of advanced offshore operations, with potential upgrades such as real-time anomaly detection that promises enhanced efficiency and safety."),Ti.forEach(t),Xe=u(e),ae=a(e,"P",{});var Ri=s(ae);v(U.$$.fragment,Ri),Ri.forEach(t),Ye=u(e),I=a(e,"H2",{id:!0});var Ei=s(I);se=a(Ei,"A",{href:!0});var Ui=s(se);Ct=m(Ui,"Vehicle"),Ui.forEach(t),Ei.forEach(t),Be=u(e),re=a(e,"P",{});var Ii=s(re);Ft=m(Ii,"My exceptional teammates ensured the SRAUV’s mechanical design adhered to principles of hydrodynamics, stability, and compactness, resulting in a sleek, efficient design. Fitting within the original constraints of a 2-foot length and width, the vehicle’s overall mass is approximately 15 kg, as illustrated below. The team cleverly configured the thrusters to offer a versatile maneuverability, giving the SRAUV 5 degrees of freedom, though effectively using only 4 - excluding pitch and roll - for the project’s final demonstration."),Ii.forEach(t),Je=u(e),le=a(e,"P",{});var Pi=s(le);v(P.$$.fragment,Pi),Pi.forEach(t),Ke=u(e),V=a(e,"H2",{id:!0});var Vi=s(V);ue=a(Vi,"A",{href:!0});var xi=s(ue);jt=m(xi,"Software Overview"),xi.forEach(t),Vi.forEach(t),et=u(e),fe=a(e,"P",{});var Li=s(fe);Nt=m(Li,"The SRAUV software is a culmination of collaborative effort, using Unity 3D game engine for fast prototyping, extensive machine learning support, and engaging visual feedback. The interface is an all-in-one GUI Simulator, allowing the user to control the vehicle, visualize thruster direction feedback, and simulate various environmental conditions. All software for the project is openly available on Github."),Li.forEach(t),tt=u(e),x=a(e,"H2",{id:!0});var Di=s(x);me=a(Di,"A",{href:!0});var zi=s(me);qt=m(zi,"Simulator"),zi.forEach(t),Di.forEach(t),it=u(e),de=a(e,"P",{});var Mi=s(de);Qt=m(Mi,"We developed a Unity-based simulator that accurately mimics the mechanics of the SRAUV. This simulator applies individual thrust vectors at each thruster’s respective angle, fine-tuning its underwater movement, often referred to as “driftyness”, to reflect the real-world feedback from experienced pilots. The simulation updates in response to these thrust commands, providing new sensor data which includes the SRAUV’s position and the relative locations of assets in the environment. This helped us efficiently and accurately test our autonomous flying solutions."),Mi.forEach(t),ot=u(e),pe=a(e,"P",{});var Oi=s(pe);v(L.$$.fragment,Oi),Oi.forEach(t),nt=u(e),D=a(e,"H2",{id:!0});var Hi=s(D);he=a(Hi,"A",{href:!0});var Wi=s(he);Zt=m(Wi,"Model Training"),Wi.forEach(t),Hi.forEach(t),at=u(e),ce=a(e,"P",{});var Ci=s(ce);Gt=m(Ci,"In addition to the main simulator, I created a lighter “ML Tank” for training the DRL algorithms. This environment include a significantly reduced polygon count, a necessary optimization since DRL algorithms are computationally expensive to simulate. Further speed enhancements were achieved by including multiple ML Tanks, allowing multiple agents to collect observations simultaneously, this can be seen below."),Ci.forEach(t),st=u(e),z=a(e,"P",{});var wi=s(z);Xt=m(wi,"Screenshot of 49 ML Tanks training simultaneously within the Unity environment. "),v(M.$$.fragment,wi),wi.forEach(t),rt=u(e),O=a(e,"H2",{id:!0});var Fi=s(O);ve=a(Fi,"A",{href:!0});var ji=s(ve);Yt=m(ji,"Autonomous Strategy"),ji.forEach(t),Fi.forEach(t),lt=u(e),ge=a(e,"P",{});var Ni=s(ge);Bt=m(Ni,"As the core designer of the Autopilot, I initially considered employing Q-learning for the SRAUV’s control system. This approach was favored due to its popularity and well-documented success. However, throughout the model selection process, I found Deep Reinforcement Learning (DRL) to be the most effective at driving in the simulator. I utilized Unity ML-Agents Toolkit for DRL training within the Unity simulator, leading to rapid experimentation with the SRAUV’s Flight Computer and Vision System."),Ni.forEach(t),ut=u(e),we=a(e,"P",{});var qi=s(we);v(H.$$.fragment,qi),qi.forEach(t),ft=u(e),ye=a(e,"P",{});var Qi=s(ye);Jt=m(Qi,"With DRL, I designed an end-to-end solution for our control system. This allowed observations to go into the model and thrust control to emerge, providing optimal control of the SRAUV through a variety of unpredictable scenarios."),Qi.forEach(t),mt=u(e),W=a(e,"H2",{id:!0});var Zi=s(W);be=a(Zi,"A",{href:!0});var Gi=s(be);Kt=m(Gi,"Model Development"),Gi.forEach(t),Zi.forEach(t),dt=u(e),_e=a(e,"P",{});var Xi=s(_e);ei=m(Xi,"For model training, I used a simplified subproblem - driving from a random X, Y, Z position to another random position as quickly as possible. I then tested various DRL solutions on these subproblems, progressively introducing complexity until the environment closely mirrored real life. This iterative approach allowed for significant improvement during model development."),Xi.forEach(t),pt=u(e),$e=a(e,"P",{});var Yi=s($e);v(C.$$.fragment,Yi),Yi.forEach(t),ht=u(e),F=a(e,"H3",{id:!0});var Bi=s(F);Ae=a(Bi,"A",{href:!0});var Ji=s(Ae);ti=m(Ji,"Model Selection"),Ji.forEach(t),Bi.forEach(t),ct=u(e),ke=a(e,"P",{});var Ki=s(ke);ii=m(Ki,"For the SRAUV control system, I considered both discrete and continuous action spaces. While a continuous action space implies real numbers for the DRL model output, a discrete one implies a fixed set of categories. I experimentally found discrete to be more effective during training. I benchmarked the Soft Actor-Critic (SAC) model against a Proximal Policy Optimization (PPO). SAC took a considerable time to train and often failed to reach the goal consistently. On the other hand, PPO found the optimal driving strategy faster and more effectively, which led to its selection for further development."),Ki.forEach(t),vt=u(e),j=a(e,"H3",{id:!0});var eo=s(j);Se=a(eo,"A",{href:!0});var to=s(Se);oi=m(to,"Reward Structure"),to.forEach(t),eo.forEach(t),gt=u(e),Te=a(e,"P",{});var io=s(Te);ni=m(io,"The reward structure found to best solve the easy environment was relatively straightforward, consisting of three different rewards. The first reward was assigned as +1 when the agent arrived within a predefined tolerance of its goal waypoint. The second reward was the negative inverse of maximum time steps -0.002, this small negative reward assigned every timestep encouraged the model to drive to the goal as fast as possible. Finally, the third reward sets the overall reward to -1 if the agent collides with anything, this also resets the run for increased training speed."),io.forEach(t),wt=u(e),Re=a(e,"P",{});var oo=s(Re);v(N.$$.fragment,oo),oo.forEach(t),yt=u(e),Ee=a(e,"P",{});var no=s(Ee);ai=m(no,"In further iterations of the training environment, I found that the agent would sometimes overshoot its goal position and accidentally crash into a wall, to help mitigate this problem a stacking negative reward was assigned whenever the agent exceeded 0.3 m/s velocity in any axis of movement. This resulted in reduced crashing and taught the model to operate at a reduced speed when nearing its goal position."),no.forEach(t),bt=u(e),q=a(e,"H3",{id:!0});var ao=s(q);Ue=a(ao,"A",{href:!0});var so=s(Ue);si=m(so,"Curriculum Learning"),so.forEach(t),ao.forEach(t),_t=u(e),Ie=a(e,"P",{});var ro=s(Ie);ri=m(ro,"Since the PPO algorithm struggled to converge when tolerances of less than 40cm were used in training, I utilized curriculum learning to overcome this challenge. This technique allowed me to progressively decrease the tolerance required to reach the goal waypoint during training, significantly enhancing the model’s performance."),ro.forEach(t),$t=u(e),Pe=a(e,"P",{});var lo=s(Pe);v(Q.$$.fragment,lo),lo.forEach(t),At=u(e),Z=a(e,"H3",{id:!0});var uo=s(Z);Ve=a(uo,"A",{href:!0});var fo=s(Ve);li=m(fo,"Localization"),fo.forEach(t),uo.forEach(t),kt=u(e),xe=a(e,"P",{});var mo=s(xe);ui=m(mo,"After our initial approach for localization, which relied on a combination of a pressure sensor, time-of-flight (TOF) sensors, and an inertial-measurement-unit (IMU), failed to meet expectations, my team and I were forced to quickly pivot. Due to issues ranging from faulty TOF sensors, an unsteady IMU, and a malfunctioning depth sensor, we had to reimagine our solution, leading us to the exploration of a computer vision-based approach. Utilizing AprilTags, similar to simple QR codes, we established a localization system that successfully tracked the position and rotation of the SRAUV relative to the tank. We installed a grid of these AprilTags on the tank floor, ensuring the bottom camera of the SRAUV was able to constantly locate a tag, significantly improving our vehicle’s spatial awareness. Impressively, this solution not only worked exceedingly well during testing, achieving an accuracy of about +-5 cm in position and +-5 degrees in heading, but it was also considerably more cost-effective than our initial sensor plan."),mo.forEach(t),St=u(e),Le=a(e,"P",{});var po=s(Le);v(G.$$.fragment,po),po.forEach(t),Tt=u(e),De=a(e,"P",{});var ho=s(De);fi=m(ho,"The AprilTags detection in the ML Tank was another area I optimized. Running the vision recognition on all 49 tanks in a single environment would have been computationally prohibitive. To address this, I added a camera with matching intrinsic parameters and position to the SRAUV’s bottom pi cam in the simulator. This allowed me to check if the AprilTag was in the camera’s frame during each timestep, providing the agent with the most recently known position & velocity estimate, simulating the noisy conditions it would face in the real world."),ho.forEach(t),Rt=u(e),ze=a(e,"P",{});var co=s(ze);v(X.$$.fragment,co),co.forEach(t),Et=u(e),Y=a(e,"H2",{id:!0});var vo=s(Y);Me=a(vo,"A",{href:!0});var go=s(Me);mi=m(go,"Real World Testing"),go.forEach(t),vo.forEach(t),Ut=u(e),Oe=a(e,"P",{});var wo=s(Oe);di=m(wo,"Below you can see some videos of real world testing the SRAUV in a tank at Memorial University."),wo.forEach(t),It=u(e),He=a(e,"P",{});var yo=s(He);v(B.$$.fragment,yo),yo.forEach(t),Pt=u(e),We=a(e,"P",{});var bo=s(We);v(J.$$.fragment,bo),bo.forEach(t),Vt=u(e),K=a(e,"H2",{id:!0});var _o=s(K);Ce=a(_o,"A",{href:!0});var $o=s(Ce);pi=m($o,"Conclusion"),$o.forEach(t),_o.forEach(t),xt=u(e),Fe=a(e,"P",{});var Ao=s(Fe);hi=m(Ao,"Wrapping up, I am incredibly proud of the progress and achievements made by my team and myself throughout our capstone project. We successfully designed, implemented, and tested a neural network-based autopilot for our Subsea Resident AUV (SRAUV) prototype. This enabled the SRAUV to perform autonomous missions, including navigating a prescribed route and redocking, a significant milestone for us. Even though we faced setbacks, such as hardware failures limiting the testing of an improved autopilot model, these challenges only fueled our drive to innovate. Our commitment paid off, winning us first place in all capstone award categories. We believe our work has set a strong foundation for future developments in autonomous subsea navigation."),Ao.forEach(t),Lt=u(e),je=a(e,"P",{});var ko=s(je);v(ee.$$.fragment,ko),ko.forEach(t),Dt=u(e),T=a(e,"P",{});var Mt=s(T);qe=a(Mt,"CODE",{});var So=s(qe);ci=m(So,"youtube: https://www.youtube.com/watch?v=v3Z9sVuU5DQ&ab_channel=AndrewNash"),So.forEach(t),vi=m(Mt,`\\
`),Qe=a(Mt,"CODE",{});var To=s(Qe);gi=m(To,"youtube: https://www.youtube.com/watch?v=UXqgjFvW4HE&t=9s&ab_channel=AndrewNash"),To.forEach(t),Mt.forEach(t),this.h()},h(){d(_,"href","#navigating-the-depths-with-rl"),d(p,"id","navigating-the-depths-with-rl"),d(oe,"href","#introduction"),d(E,"id","introduction"),d(se,"href","#vehicle"),d(I,"id","vehicle"),d(ue,"href","#software-overview"),d(V,"id","software-overview"),d(me,"href","#simulator"),d(x,"id","simulator"),d(he,"href","#model-training"),d(D,"id","model-training"),d(ve,"href","#autonomous-strategy"),d(O,"id","autonomous-strategy"),d(be,"href","#model-development"),d(W,"id","model-development"),d(Ae,"href","#model-selection"),d(F,"id","model-selection"),d(Se,"href","#reward-structure"),d(j,"id","reward-structure"),d(Ue,"href","#curriculum-learning"),d(q,"id","curriculum-learning"),d(Ve,"href","#localization"),d(Z,"id","localization"),d(Me,"href","#real-world-testing"),d(Y,"id","real-world-testing"),d(Ce,"href","#conclusion"),d(K,"id","conclusion")},m(e,i){o(e,p,i),r(p,_),r(_,k),o(e,S,i),o(e,h,i),r(h,A),o(e,R,i),o(e,ie,i),r(ie,Ne),r(Ne,Ot),o(e,Ze,i),o(e,E,i),r(E,oe),r(oe,Ht),o(e,Ge,i),o(e,ne,i),r(ne,Wt),o(e,Xe,i),o(e,ae,i),g(U,ae,null),o(e,Ye,i),o(e,I,i),r(I,se),r(se,Ct),o(e,Be,i),o(e,re,i),r(re,Ft),o(e,Je,i),o(e,le,i),g(P,le,null),o(e,Ke,i),o(e,V,i),r(V,ue),r(ue,jt),o(e,et,i),o(e,fe,i),r(fe,Nt),o(e,tt,i),o(e,x,i),r(x,me),r(me,qt),o(e,it,i),o(e,de,i),r(de,Qt),o(e,ot,i),o(e,pe,i),g(L,pe,null),o(e,nt,i),o(e,D,i),r(D,he),r(he,Zt),o(e,at,i),o(e,ce,i),r(ce,Gt),o(e,st,i),o(e,z,i),r(z,Xt),g(M,z,null),o(e,rt,i),o(e,O,i),r(O,ve),r(ve,Yt),o(e,lt,i),o(e,ge,i),r(ge,Bt),o(e,ut,i),o(e,we,i),g(H,we,null),o(e,ft,i),o(e,ye,i),r(ye,Jt),o(e,mt,i),o(e,W,i),r(W,be),r(be,Kt),o(e,dt,i),o(e,_e,i),r(_e,ei),o(e,pt,i),o(e,$e,i),g(C,$e,null),o(e,ht,i),o(e,F,i),r(F,Ae),r(Ae,ti),o(e,ct,i),o(e,ke,i),r(ke,ii),o(e,vt,i),o(e,j,i),r(j,Se),r(Se,oi),o(e,gt,i),o(e,Te,i),r(Te,ni),o(e,wt,i),o(e,Re,i),g(N,Re,null),o(e,yt,i),o(e,Ee,i),r(Ee,ai),o(e,bt,i),o(e,q,i),r(q,Ue),r(Ue,si),o(e,_t,i),o(e,Ie,i),r(Ie,ri),o(e,$t,i),o(e,Pe,i),g(Q,Pe,null),o(e,At,i),o(e,Z,i),r(Z,Ve),r(Ve,li),o(e,kt,i),o(e,xe,i),r(xe,ui),o(e,St,i),o(e,Le,i),g(G,Le,null),o(e,Tt,i),o(e,De,i),r(De,fi),o(e,Rt,i),o(e,ze,i),g(X,ze,null),o(e,Et,i),o(e,Y,i),r(Y,Me),r(Me,mi),o(e,Ut,i),o(e,Oe,i),r(Oe,di),o(e,It,i),o(e,He,i),g(B,He,null),o(e,Pt,i),o(e,We,i),g(J,We,null),o(e,Vt,i),o(e,K,i),r(K,Ce),r(Ce,pi),o(e,xt,i),o(e,Fe,i),r(Fe,hi),o(e,Lt,i),o(e,je,i),g(ee,je,null),o(e,Dt,i),o(e,T,i),r(T,qe),r(qe,ci),r(T,vi),r(T,Qe),r(Qe,gi),zt=!0},p:Lo,i(e){zt||(w(U.$$.fragment,e),w(P.$$.fragment,e),w(L.$$.fragment,e),w(M.$$.fragment,e),w(H.$$.fragment,e),w(C.$$.fragment,e),w(N.$$.fragment,e),w(Q.$$.fragment,e),w(G.$$.fragment,e),w(X.$$.fragment,e),w(B.$$.fragment,e),w(J.$$.fragment,e),w(ee.$$.fragment,e),zt=!0)},o(e){y(U.$$.fragment,e),y(P.$$.fragment,e),y(L.$$.fragment,e),y(M.$$.fragment,e),y(H.$$.fragment,e),y(C.$$.fragment,e),y(N.$$.fragment,e),y(Q.$$.fragment,e),y(G.$$.fragment,e),y(X.$$.fragment,e),y(B.$$.fragment,e),y(J.$$.fragment,e),y(ee.$$.fragment,e),zt=!1},d(e){e&&t(p),e&&t(S),e&&t(h),e&&t(R),e&&t(ie),e&&t(Ze),e&&t(E),e&&t(Ge),e&&t(ne),e&&t(Xe),e&&t(ae),b(U),e&&t(Ye),e&&t(I),e&&t(Be),e&&t(re),e&&t(Je),e&&t(le),b(P),e&&t(Ke),e&&t(V),e&&t(et),e&&t(fe),e&&t(tt),e&&t(x),e&&t(it),e&&t(de),e&&t(ot),e&&t(pe),b(L),e&&t(nt),e&&t(D),e&&t(at),e&&t(ce),e&&t(st),e&&t(z),b(M),e&&t(rt),e&&t(O),e&&t(lt),e&&t(ge),e&&t(ut),e&&t(we),b(H),e&&t(ft),e&&t(ye),e&&t(mt),e&&t(W),e&&t(dt),e&&t(_e),e&&t(pt),e&&t($e),b(C),e&&t(ht),e&&t(F),e&&t(ct),e&&t(ke),e&&t(vt),e&&t(j),e&&t(gt),e&&t(Te),e&&t(wt),e&&t(Re),b(N),e&&t(yt),e&&t(Ee),e&&t(bt),e&&t(q),e&&t(_t),e&&t(Ie),e&&t($t),e&&t(Pe),b(Q),e&&t(At),e&&t(Z),e&&t(kt),e&&t(xe),e&&t(St),e&&t(Le),b(G),e&&t(Tt),e&&t(De),e&&t(Rt),e&&t(ze),b(X),e&&t(Et),e&&t(Y),e&&t(Ut),e&&t(Oe),e&&t(It),e&&t(He),b(B),e&&t(Pt),e&&t(We),b(J),e&&t(Vt),e&&t(K),e&&t(xt),e&&t(Fe),e&&t(Lt),e&&t(je),b(ee),e&&t(Dt),e&&t(T)}}}function Mo(te){let p,_;const k=[te[0],Uo];let S={$$slots:{default:[zo]},$$scope:{ctx:te}};for(let h=0;h<k.length;h+=1)S=yi(S,k[h]);return p=new Do({props:S}),{c(){c(p.$$.fragment)},l(h){v(p.$$.fragment,h)},m(h,A){g(p,h,A),_=!0},p(h,[A]){const R=A&1?xo(k,[A&1&&Ro(h[0]),A&0&&Ro(Uo)]):{};A&2&&(R.$$scope={dirty:A,ctx:h}),p.$set(R)},i(h){_||(w(p.$$.fragment,h),_=!0)},o(h){y(p.$$.fragment,h),_=!1},d(h){b(p,h)}}}const Uo={title:"Subsea Resident Autonomous Underwater Vehicle",image:"/srauv/team.jpg",alt:"SRAUV",created:"2020-05-02T00:00:00.000Z",tags:["Computer Vision","RL"],updated:"2023-06-14T03:31:28.125Z",images:[],slug:"/srauv/+page.svelte.md",path:"/srauv",toc:[{depth:1,title:"Navigating the Depths with RL",slug:"navigating-the-depths-with-rl"},{depth:2,title:"Introduction",slug:"introduction"},{depth:2,title:"Vehicle",slug:"vehicle"},{depth:2,title:"Software Overview",slug:"software-overview"},{depth:2,title:"Simulator",slug:"simulator"},{depth:2,title:"Model Training",slug:"model-training"},{depth:2,title:"Autonomous Strategy",slug:"autonomous-strategy"},{depth:2,title:"Model Development",slug:"model-development"},{depth:3,title:"Model Selection",slug:"model-selection"},{depth:3,title:"Reward Structure",slug:"reward-structure"},{depth:3,title:"Curriculum Learning",slug:"curriculum-learning"},{depth:3,title:"Localization",slug:"localization"},{depth:2,title:"Real World Testing",slug:"real-world-testing"},{depth:2,title:"Conclusion",slug:"conclusion"}]};function Oo(te,p,_){return te.$$set=k=>{_(0,p=yi(yi({},p),Eo(k)))},p=Eo(p),[p]}class Fo extends Io{constructor(p){super(),Po(this,p,Oo,Mo,Vo,{})}}export{Fo as component};