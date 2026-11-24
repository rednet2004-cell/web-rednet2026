# Pista sintetizada para el reel Wasaff: 20 s, 120 BPM, Fa mayor, tono confiable y luminoso.
import numpy as np, wave, sys
SR=48000; DUR=20.0; N=int(SR*DUR); t=np.arange(N)/SR
rng=np.random.default_rng(11)
out=np.zeros((N,2))
def env(n,a,d):
    e=np.ones(n); A=int(a*SR); D=int(d*SR)
    if A: e[:A]=np.linspace(0,1,A)
    if D: e[-D:]*=np.linspace(1,0,D)
    return e
def add(sig,start,pan=0.0,gain=1.0):
    i=int(start*SR); j=min(N,i+len(sig)); s=sig[:j-i]*gain
    out[i:j,0]+=s*(1-pan)*0.5+s*0.5*(1-abs(pan)); out[i:j,1]+=s*(1+pan)*0.5+s*0.5*(1-abs(pan))
def lp(x,a):  # one-pole low-pass
    y=np.zeros_like(x); acc=0.0
    for k in range(len(x)): acc+=a*(x[k]-acc); y[k]=acc
    return y
def saw(f,n,det=0.0):
    tt=np.arange(n)/SR; return 2*((tt*f*(1+det))%1)-1
# Pad: acordes Dm - Bb - F - C cada 4 s (cortes del video en 3.5, 7.5...)
chords=[[174.61,220.0,261.63],[146.83,174.61,220.0],[116.54,146.83,174.61],[130.81,164.81,196.0],[174.61,220.0,261.63]]
starts=[0,3.5,7.5,11.5,15.5]
for c,(st) in zip(chords,starts):
    d=(4.5 if st<15.5 else 4.5); n=int(d*SR)
    x=sum(saw(f,n,0.003)+saw(f,n,-0.004) for f in c)/6
    x=lp(x,0.035)*env(n,0.6,1.0)
    add(x,st,0,0.55)
# Sub-bajo en negras desde 3.5
beat=0.5
for k in range(int((19.5-3.5)/beat)):
    st=3.5+k*beat; ci=min(4,int((st-3.5)//4)+1); f=chords[ci][0]/2
    n=int(0.45*SR); tt=np.arange(n)/SR
    x=np.sin(2*np.pi*f*tt)*np.exp(-tt*5)
    add(x,st,0,0.35)
# Bombo suave en cada pulso desde 3.5 hasta 17
def kick():
    n=int(0.35*SR); tt=np.arange(n)/SR; f=50+90*np.exp(-tt*30)
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*9)
for k in range(int((17.0-3.5)/beat)):
    add(kick(),3.5+k*beat,0,0.6)
# Hi-hat metálico en contratiempos desde 7.5
def hat():
    n=int(0.06*SR); x=rng.standard_normal(n); x=x-lp(x,0.3); return x*np.exp(-np.arange(n)/SR*60)
for k in range(int((15.5-7.5)/beat)):
    add(hat(),7.5+k*beat+beat/2,0.3 if k%2 else -0.3,0.12)
# Golpe metálico (impacto) en cada corte
def clang():
    n=int(1.6*SR); tt=np.arange(n)/SR
    x=sum(np.sin(2*np.pi*f*tt)*a for f,a in [(220,1),(553,.6),(1187,.35),(1931,.2)])
    nz=rng.standard_normal(n)*np.exp(-tt*40)*0.5
    return (x*np.exp(-tt*3.2)+nz)/2
for st in [3.5,7.5,11.5,15.5]:
    add(clang(),st,-0.2 if st in(3.5,11.5) else 0.2,0.32)
# Subida de ruido antes del cierre
n=int(1.5*SR); x=rng.standard_normal(n); x=lp(x,0.08)*np.linspace(0,1,n)**2
add(x,14.0,0,0.18)
# Arpegio suave en el cierre
for k,f in enumerate([349.23,440.0,523.25,698.46]):
    n=int(2.5*SR); tt=np.arange(n)/SR
    add(np.sin(2*np.pi*f*tt)*np.exp(-tt*1.6),16.0+k*0.25,(-0.4+k*0.27),0.12)
# Master: fade in/out, normalización
out*=np.clip(t/0.4,0,1)[:,None]; out*=np.clip((DUR-t)/1.5,0,1)[:,None]
out=np.tanh(out*1.2); out/=np.max(np.abs(out))*1.12
pcm=(out*32767).astype(np.int16)
w=wave.open(sys.argv[1],'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes()); w.close()
print('ok')
