<?php
// ORBIT API: place beside orbit.html, orbit.css and orbit.js in htdocs/orbit-space.
declare(strict_types=1);
session_start();
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$missions = [
 ['year'=>'2024','name'=>'Europa Clipper','description'=>'NASA spacecraft launched to investigate Jupiter’s icy moon Europa and assess whether it could have conditions suitable for life.','status'=>'EN ROUTE'],
 ['year'=>'2021','name'=>'James Webb Space Telescope','description'=>'A powerful space observatory studying early galaxies, star formation, and the atmospheres of exoplanets.','status'=>'OPERATING'],
 ['year'=>'2020','name'=>'Mars Perseverance Rover','description'=>'A robotic explorer studying Jezero Crater and collecting samples for possible return to Earth.','status'=>'OPERATING'],
 ['year'=>'2018','name'=>'Parker Solar Probe','description'=>'A mission flying through the Sun’s outer atmosphere to study the solar wind and corona.','status'=>'OPERATING']
];
$questions = [
 ['question'=>'Which planet is known as the Red Planet?','options'=>['Venus','Mars','Mercury','Jupiter'],'answer'=>1,'explanation'=>'Mars looks reddish because iron minerals in its soil have oxidized, or rusted.'],
 ['question'=>'Which planet has the most prominent ring system?','options'=>['Earth','Neptune','Saturn','Uranus'],'answer'=>2,'explanation'=>'Saturn’s bright rings are made mostly of ice particles with rocky material.'],
 ['question'=>'Which galaxy contains our solar system?','options'=>['Andromeda','Whirlpool','Sombrero','Milky Way'],'answer'=>3,'explanation'=>'Our solar system is located in the Milky Way, a barred spiral galaxy.']
];
$action=$_GET['action']??'';
if($action==='missions' && $_SERVER['REQUEST_METHOD']==='GET'){echo json_encode(['missions'=>$missions],JSON_UNESCAPED_UNICODE);exit;}
if($action==='quiz' && $_SERVER['REQUEST_METHOD']==='GET'){echo json_encode(['questions'=>$questions],JSON_UNESCAPED_UNICODE);exit;}
if($action==='score' && $_SERVER['REQUEST_METHOD']==='POST'){
 $data=json_decode(file_get_contents('php://input')?:'',true);
 $score=filter_var($data['score']??null,FILTER_VALIDATE_INT);$total=filter_var($data['total']??null,FILTER_VALIDATE_INT);
 if($score===false||$total===false||$total<1||$score<0||$score>$total){http_response_code(400);echo json_encode(['ok'=>false,'message'=>'Invalid score.']);exit;}
 $_SESSION['orbit_last_score']=['score'=>$score,'total'=>$total,'saved_at'=>date(DATE_ATOM)];
 echo json_encode(['ok'=>true,'message'=>'Score saved for this session.']);exit;
}
http_response_code(404);echo json_encode(['ok'=>false,'message'=>'Unknown ORBIT endpoint.']);
?>