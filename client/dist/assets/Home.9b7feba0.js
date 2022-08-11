import{i as oe,a as i,d as s,j as e,F as $,c as se}from"./recharts.547c5d9d.js";import{u as I,S as ae,D as ne,a as ie,b as le,T as w,c as ce,A as H,F as U,d as R,M as de}from"./StyledDialog.5638ee45.js";import{a as W,s as b,C as me,u as F,b as X,A as J,T as pe}from"./index.9b5234d1.js";import{c as ue,r as fe,B as f,i as j,T as G,a as k,G as N,A as xe}from"./jsx-runtime_commonjs-proxy.f3a4d8a3.js";import{P as L,c as he,a as B,b as ge,o as ve}from"./object.3f15d918.js";import{B as K}from"./Box.dbcd5815.js";var q={},be=oe.exports;Object.defineProperty(q,"__esModule",{value:!0});var Q=q.default=void 0,ye=be(ue),Se=fe,Ee=(0,ye.default)((0,Se.jsx)("path",{d:"M16.01 11H4v2h12.01v3L20 12l-3.99-4z"}),"ArrowRightAlt");Q=q.default=Ee;const we="/api/tokens",Y=W.create({baseURL:we}),$e=r=>Y.post("/",r),Ce=(r,a,o)=>Y.post(`/${r}/${a}`,o),Te={createToken:$e,resetPassword:Ce},Ne="ResetPassword",Z={helper:`${Ne}-helper`},Pe=b("form")(({theme:r})=>({display:"flex",flexDirection:"column",gap:"1rem",[`& .${Z.helper}`]:{color:r.palette.text.primary}})),Re=({open:r,setOpen:a})=>{const[o,n]=i.exports.useState(!1),[y,t]=i.exports.useState(!1),[l,m]=i.exports.useState(!1),{register:x,handleSubmit:h,formState:{errors:g}}=I({mode:"onBlur",defaultValues:{email:""}});return s(ae,{open:r,setOpen:a,labelledby:"reset-password",children:[e(ne,{id:"reset-password-title",children:"R\xE9initialisez votre mot de passe"}),e(ie,{children:o?e(me,{}):s($,{children:[e(le,{children:"Vous \xEAtes sur le point de r\xE9initialiser votre mot de passe. Vous receverez un email avec un lien permettant de r\xE9initialiser votre mot de passe."}),e(Pe,{onSubmit:h(p=>{if(n(!0),!j(p.email)){n(!1);return}Te.createToken(p).then(()=>{m(!0)}).catch(u=>{if(W.isAxiosError(u)){console.error(u.response),t(!0);return}console.error({error:u}),t(!0)}).finally(()=>{n(!1)})}),id:"new-todo",children:e(w,{...x("email",{required:!0}),helperText:g.email&&"L'email est obligatoire",label:"Entrez votre email",type:"email",color:"info",variant:"filled",required:!0,FormHelperTextProps:{className:Z.helper}})})]})}),!o&&s(ce,{children:[y&&e(H,{severity:"error",onClose:()=>t(!1),sx:{mx:4},children:"Un probl\xE8me est survenu, veuillez r\xE9essayer"}),l&&e(H,{severity:"success",onClose:()=>m(!1),sx:{mx:4},children:"Un email vous a \xE9t\xE9 envoy\xE9 pour r\xE9initialiser votre mot de passe."}),e(f,{autoFocus:!0,color:"info",onClick:()=>a(!1),children:"Annuler"}),e(f,{type:"submit",form:"new-todo",color:"info",autoFocus:!0,children:"Valider"})]})]})},Le=r=>{const[a,o]=i.exports.useState(!1);return s($,{children:[e(f,{color:"info",variant:"text",onClick:()=>o(!0),endIcon:e(Q,{color:"info"}),children:"Mot de passe oubli\xE9 ?"}),a&&e(Re,{open:a,setOpen:o})]})},O="Login",P={btnContainer:`${O}-btnContainer`,helper:`${O}-helper`},Ae=b("form")(({theme:r})=>({display:"flex",flexDirection:"column",gap:"2rem",width:"70%",[`& .${P.btnContainer}`]:{display:"flex",flexDirection:"column",gap:".5rem",alignItems:"center",justifyContent:"center"},[`& .${P.helper}`]:{color:r.palette.text.primary}})),Ie=r=>{var p;const a=F(),o=X(),{from:n}=(o==null?void 0:o.state)||{pathname:"/dashboard"},{login:y}=se.useContext(J),{getTodos:t}=i.exports.useContext(pe),l=I({mode:"onBlur"}),[m,x]=i.exports.useState(!1),[h,g]=i.exports.useState(),S=async u=>{try{const E=await y(u);await t(E._id),a(n?n.pathname:"/dashboard")}catch(E){g(E),x(!0)}};return e(U,{...l,children:s(Ae,{onSubmit:l.handleSubmit(S),children:[n&&(n==null?void 0:n.pathname)?e(R,{severity:"warning",children:"Veuillez vous connecter pour acc\xE8der \xE0 cette page"}):null,e(w,{...l.register("email",{required:!0,validate:j}),defaultValue:"",helperText:l.formState.errors.email&&"Vous devez saisir un email valide",FormHelperTextProps:{className:P.helper},color:"info",type:"email",label:"Email",variant:"filled",required:!0}),e(L,{name:"password",options:{required:{value:!0,message:"Le mot de passe est obligatoire"},minLength:{value:6,message:"Le mot de passe doit contenir au moins 6 caract\xE8res"}},color:"info",defaultValue:"",error:l.formState.errors.password!==void 0,errorMessage:(p=l.formState.errors.password)==null?void 0:p.message,fullWidth:!0,id:"login-password",label:"Mot de passe"}),m&&e(R,{onClose:()=>{x(!1),g("")},severity:"error",children:s($,{children:["Une erreur est survenue, veuillez r\xE9essayer.",e("br",{}),"Message: ",h]})}),s("div",{className:P.btnContainer,children:[e(Le,{}),e(f,{variant:"contained",color:"info",type:"submit",children:"Se connecter"})]})]})})},Fe={display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:"2rem",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:"50%",maxWidth:"90%",height:"auto",maxHeight:"90%",bgcolor:"background.paper",border:"2px solid #000",boxShadow:24,p:4},C="Signup",c={container:`${C}-container`,title:`${C}-title`,btnContainer:`${C}-btnContainer`,helper:`${C}-helper`},je=b(de)(({theme:r})=>({[`& .${c.title}`]:{marginTop:"20px",marginBottom:"20px",color:r.palette.text.primary,display:"flex",width:"100%",justifyContent:"center",alignItems:"center",textAlign:"center"},[`& .${c.title}:before`]:{content:'""',borderTop:`1px solid ${r.palette.secondary.main}`,margin:"0 20px 0 0",flex:"1 0 20px"},[`& .${c.title}:after`]:{content:'""',borderTop:`1px solid ${r.palette.secondary.main}`,margin:"0 0 0 20px",flex:"1 0 20px"}})),qe=b("form")(({theme:r})=>({display:"flex",flexDirection:"column",gap:"2rem",width:"70%",[`& .${c.btnContainer}`]:{display:"flex",alignItems:"center",justifyContent:"space-evenly"},[`& .${c.helper}`]:{color:r.palette.text.primary}})),Me=r=>{var M,D,V,_,z;const{signup:a}=i.exports.useContext(J),o=X(),{from:n}=(o==null?void 0:o.state)||{pathname:"/dashboard"},y=he().shape({password:B().required("Le mot de passe est obligatoire").min(6,"Le mot de passe doit contenir au moins 6 caract\xE8res"),confirmPwd:B().required("Le mot de passe est obligatoire").oneOf([ge("password")],"Les mots de passe ne sont pas identiques")}),t=I({mode:"onBlur",resolver:ve(y)}),[l,m]=i.exports.useState(!1),[x,h]=i.exports.useState(!1),[g,S]=i.exports.useState(),p=F(),u=()=>m(!0),E=()=>m(!1),ee=async v=>{const re={email:v.email,password:v.password,firstName:v.firstName,lastName:v.lastName};try{await a(re),p(n?n.pathname:"/dashboard")}catch(te){S(te),h(!0)}};return s($,{children:[e(f,{variant:"contained",color:"info",type:"button",onClick:u,children:"Je me cr\xE9er mon compte"}),e(je,{open:l,onClose:E,"aria-labelledby":"Se cr\xE9er un compte","aria-describedby":"Remplir le formulaire pour se cr\xE9er un compte",children:s(K,{sx:Fe,children:[e(G,{variant:"h4",component:"h2",align:"center",className:c.title,children:"Se cr\xE9er un compte"}),e(U,{...t,children:s(qe,{onSubmit:t.handleSubmit(ee),children:[e(w,{...t.register("firstName",{required:{value:!0,message:"Le pr\xE9nom est obligatoire"},validate:k||"Le pr\xE9nom contient des caract\xE8res sp\xE9ciaux non autoris\xE9s"}),helperText:t.formState.errors.firstName&&((M=t.formState.errors.firstName)==null?void 0:M.message),FormHelperTextProps:{className:c.helper},label:"Pr\xE9nom",type:"text",color:"info",variant:"filled",required:!0}),e(w,{...t.register("lastName",{required:{value:!0,message:"Le nom est obligatoire"},validate:v=>k(v)||"Le nom contient des caract\xE8res sp\xE9ciaux non autoris\xE9s"}),helperText:t.formState.errors.lastName&&((D=t.formState.errors.lastName)==null?void 0:D.message),FormHelperTextProps:{className:c.helper},label:"Nom",type:"text",color:"info",variant:"filled",required:!0}),e(w,{...t.register("email",{required:{value:!0,message:"L'email est obligatoire"},validate:j||"Vous devez saisir un email valide"}),defaultValue:"",helperText:t.formState.errors.email&&((V=t.formState.errors.email)==null?void 0:V.message),FormHelperTextProps:{className:c.helper},color:"info",type:"email",label:"Email",variant:"filled",required:!0}),e(L,{name:"password",color:"info",defaultValue:"",error:t.formState.errors.password!==void 0,errorMessage:(_=t.formState.errors.password)==null?void 0:_.message,fullWidth:!0,id:"signup-password",label:"Mot de passe"}),e(L,{name:"confirmPwd",color:"info",defaultValue:"",error:t.formState.errors.confirmPwd!==void 0,errorMessage:(z=t.formState.errors.confirmPwd)==null?void 0:z.message,fullWidth:!0,id:"confirm-signup-password",label:"Confirmez le mot de passe"}),x&&e(R,{onClose:()=>{h(!1),S("")},severity:"error",children:s($,{children:["Une erreur est survenue, veuillez r\xE9essayer.",e("br",{}),"Message: ",g]})}),s("div",{className:c.btnContainer,children:[e(f,{variant:"contained",color:"info",type:"reset",children:"R\xC9INITIALISER"}),e(f,{variant:"contained",color:"info",type:"submit",children:"VALIDER"})]})]})})]})})]})},T="Home",d={root:`${T}-root`,left:`${T}-left`,right:`${T}-right`,logo:`${T}-logo`},De=b("div")(({theme:r})=>({[`& .${d.root}`]:{display:"flex",flexDirection:"row",width:"100vw",height:"100vh",minHeight:"100vh"},[`& .${d.left}`]:{backgroundColor:r.palette.secondary.main,width:"50vw",paddingTop:"10%"},[`& .${d.right}`]:{width:"50vw",backgroundColor:r.palette.primary.main},[`& .${d.logo}`]:{height:"auto",width:"auto",alignSelf:"center",marginBottom:"1.5rem","&:hover":{cursor:"pointer"}}})),Ve=({children:r})=>{const a=F();return e(De,{children:s(N,{className:d.root,children:[e(N,{item:!0,container:!0,justifyContent:"center",className:d.left,children:e(K,{component:"img",sx:{height:400,width:400},alt:"Une illustration des t\xE2ches complet\xE9es",src:"/images/todo_illustration.svg"})}),s(N,{item:!0,container:!0,direction:"column",justifyContent:"center",alignItems:"center",className:d.right,children:[e(xe,{variant:"square",alt:"TODO",src:"/images/logo_size.jpg",onClick:()=>a("/"),className:d.logo}),r]})]})})},A=b(G)(({theme:r})=>({marginTop:"20px",marginBottom:"20px",color:r.palette.text.primary,display:"flex",width:"100%",justifyContent:"center",alignItems:"center",textAlign:"center",["&:before"]:{content:'""',borderTop:`1px solid ${r.palette.secondary.main}`,margin:"0 20px 0 0",flex:"1 0 20px"},["&:after"]:{content:'""',borderTop:`1px solid ${r.palette.secondary.main}`,margin:"0 0 0 20px",flex:"1 0 20px"}})),_e=r=>s(Ve,{children:[e(A,{variant:"h5",align:"center",children:"J\u2019ai d\xE9j\xE0 un compte"}),e(Ie,{}),e(A,{variant:"h5",align:"center",children:"Je souhaite cr\xE9er un compte"}),e(N,{container:!0,direction:"row",justifyContent:"space-around",alignItems:"center",children:e(Me,{})})]});var We=Object.freeze(Object.defineProperty({__proto__:null,StyledTypo:A,default:_e},Symbol.toStringTag,{value:"Module"}));export{We as H,Ve as R,A as S,Te as t};
