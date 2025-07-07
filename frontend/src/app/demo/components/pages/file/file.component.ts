import { Component, ChangeDetectorRef } from '@angular/core';
import { PredictService } from 'src/app/demo/service/predict.service';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/demo/service/auth.service';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent {
  predictions: string[] = [];
  visible: boolean = false;
  audio_Url: string = '';
  progress: number = 0;
  interval = null;

  constructor(private predictionService: PredictService, private message: MessageService, private cdr: ChangeDetectorRef, private auth: AuthService) { }

  ngAfterViewInit(): void {
    this.verifyAuthState();
  }

  // Este método se llama cuando el archivo se sube
  onFileUpload(event: any): void {
    this.showConfirm();

    const file = event.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const fileData = reader.result as string;
      
      // Llamamos al servicio para hacer la predicción con la imagen cargada
      this.predictionService.predictImage(fileData).subscribe(
        (response) => {
          this.predictions = response.predictions;  // Las predicciones vienen del backend
          this.audio_Url = response.audio_url
          console.log("lol", this.audio_Url)  // Las predicciones vienen del backend
          console.log('Predicciones:', this.predictions);
          this.showSuccess();
          this.showInfo();
          this.onClose();
        },
        (error) => {
          console.error('Error al predecir:', error);
          this.showError();
        }
      );
    };

    reader.readAsDataURL(file); // Convertir archivo a base64
  }

  // Mostrar éxito cuando las predicciones se hacen correctamente
  showSuccess() {
    this.message.add({ severity: 'success', summary: 'Success', detail: 'Predicciones realizadas con éxito!' });
  }

  // Mostrar información sobre las predicciones
  showInfo() {
    this.message.add({ severity: 'info', summary: 'Info', detail: 'Revisar las predicciones en la sección 2' });
  }

  // Mostrar error si ocurre un problema en la predicción
  showError() {
    this.message.add({ severity: 'error', summary: 'Error', detail: 'Error al predecir' });
  }

  // Manejar el progreso de la carga del archivo
  showConfirm() {
    if (!this.visible) {
      this.message.add({ key: 'confirm', sticky: true, severity: 'custom', summary: 'Subiendo tu imagen...' });
      this.visible = true;
      this.progress = 0;

      if (this.interval) {
        clearInterval(this.interval);
      }

      this.interval = setInterval(() => {
        if (this.progress <= 100) {
          this.progress = this.progress + 20;
        }

        if (this.progress >= 100) {
          this.progress = 100;
          clearInterval(this.interval);
        }
        this.cdr.markForCheck();
      }, 1000);
    }
  }

  // Cerrar la notificación
  onClose() {
    this.visible = false;
    this.message.clear('confirm');
  }

  playAudio(audioUrl : string): void {
    const audio = new Audio(audioUrl);
    audio.play();
    console.log( "xd" , audioUrl);
  }

  verifyAuthState(): void {
    if (!this.auth.checkLoggedIn()) {
      this.message.add({ severity: 'info', summary: 'Advertencia', detail: 'Estimado usuario, para poder realizar predicciones debe iniciar sesion.' });
    }
  }
}
