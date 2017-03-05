import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { PersonDetailsService } from '../person-details.service';
import { Person } from '../person';
import { Occasion } from '../occasion';
import { Router } from '@angular/router';
import { CommonService } from '../common.service';
import { PersonsService } from '../persons.service';

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.css']
})
export class PersonDetailsComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, private personDetailsService: PersonDetailsService, private router: Router, private personService: PersonsService, private commonService: CommonService) { }

  id: number;
  private sub: any;
  selectedPerson: Person;
  backupPerson: Person;
  backupOccasion: Occasion;
  readonlyPersonalDetails: boolean = true;
  readOnlyOccasion: boolean = true;
  selectedOccasion: Occasion;
  createOccasion: boolean = false;
  active = true;

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.personDetailsService.getPersonById(this.id).subscribe(person => {
      this.selectedPerson = person;
    });
  }

  onPersonalDetailsUpdateClick(): void {
    this.readonlyPersonalDetails = false;
    this.backupPerson = JSON.parse(JSON.stringify(this.selectedPerson));   
  }

  onPersonlDetailsUpdateCancleClick(): void {
    this.readonlyPersonalDetails = true;
    this.selectedPerson = JSON.parse(JSON.stringify(this.backupPerson));
  }

  onPersonDetailsSaveClick(): void {
    alert(this.selectedPerson.dob);
    this.personDetailsService.updatePerson(this.selectedPerson.id, this.selectedPerson).subscribe(person => {
      this.selectedPerson = person;
      this.readonlyPersonalDetails = true;
      this.ngOnInit();
    });
  }

  onOccasionUpdateClick(occasion: Occasion): void {
    this.selectedOccasion = occasion;
    this.readOnlyOccasion = false;
    this.createOccasion = false;
    this.backupPerson = JSON.parse(JSON.stringify(this.selectedPerson));
  }

  onOccasionDeleteClick(occasion: Occasion): void {
    this.selectedPerson.occasionList = this.selectedPerson.occasionList.filter(occasionItem => occasion.id !== occasionItem.id);
    this.personDetailsService.updatePerson(this.selectedPerson.id, this.selectedPerson).subscribe(person => {
      this.personDetailsService.getPersonById(this.id).subscribe(person => {
        this.selectedPerson = person;
      });
    });
  }

  onOccasionUpdateCancleClick(): void {
    this.readOnlyOccasion = true;
    this.selectedPerson = JSON.parse(JSON.stringify(this.backupPerson));
  }

  onOccasionUpdateSaveClick(): void {
    if (this.createOccasion) {
      this.selectedPerson.occasionList.push(this.selectedOccasion);
    }
    this.personDetailsService.updatePerson(this.selectedPerson.id, this.selectedPerson).subscribe(person => {
      this.selectedPerson = person;
      this.readOnlyOccasion = true;
      this.ngOnInit();
    });
  }

  onOccasionCreateClick(): void {
    this.readOnlyOccasion = false;
    this.createOccasion = true;
    this.selectedOccasion = new Occasion();
    this.selectedOccasion.remindMe = true;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  parseDate(dateString: string): Date {
    if (dateString) {
      return new Date(dateString);
    } else {
      return null;
    }
  }

}
