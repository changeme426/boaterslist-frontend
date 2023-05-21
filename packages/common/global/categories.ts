export interface Category {
  categoryId: string
  categoryNumber?: string
  categoryName?: string
  subCategoryId?: string
  subCategoryNumber?: string
  subCategoryName?: string
  subCategories?: Category[]
  active?: string
}

// TODO fetch categories periodically from Opensearch


var allCategories: Category[]
var categories: { [id: number]: Category }
var subCategories: { [id: number]: Category }
// categories and sub categories
var categoriesByName: { [name: string]: Category }

function init() {
  if (categories) {
    // already initialized
    return
  }
  allCategories = []
  categories = {}
  categoriesByName = {}
  subCategories = {}
  rawCategories.forEach(c => {
    if (c.categoryId && c.categoryName) {
      categoriesByName[(c.categoryName as string).toLowerCase()] = c
      c.subCategories = []
      categories[parseInt(c.categoryId)] = c
      allCategories.push(c)
    }
    if (c.subCategoryId) {
      categoriesByName[(c.subCategoryName as string).toLowerCase()] = c
      let parent = categories[parseInt(c.categoryId)]
      if (parent && parent.subCategories) {
        parent.subCategories.push(c)
      }
      subCategories[parseInt(c.subCategoryId)] = c
    }
  })

  for (let id in subCategories) {
    let sc = subCategories[id]
    if (sc.categoryId && !sc.categoryName) {
      sc.categoryName = categories[parseInt(sc.categoryId)]?.categoryName
    }
  }
}

export function getCategoryByName(name: string): Category {
  init()
  return categoriesByName[name.toLowerCase()]
}

export function getAllCategories(): Category[] {
  init()
  return allCategories
}

export function getCategory(id: number): Category | undefined {
  init()
  return categories[id]
}

export function getSubCategory(id: number): Category | undefined {
  init()
  return subCategories[id]
}

export function getRawCategories() {
  return rawCategories;
}

export function getCategoriesForSubCategories(sca: number[]): number[] {
  const c: any = {}
  const ca: number[] = []
  sca.forEach(v => {
    const sc = subCategories[v]
    if (sc) {
      const cid = parseInt(sc.categoryId)
      if (!c[cid]) {
        c[cid] = true
        ca.push(cid)
      }
    }
  })
  return ca
}

const rawCategories: Array<Category> = [
  { "categoryId": "1", "categoryNumber": "100", "categoryName": "Marinas", "active": "1" },
  { "categoryId": "2", "categoryNumber": "200", "categoryName": "Rentals", "active": "1" },
  { "categoryId": "3", "categoryNumber": "300", "categoryName": "Marine Services", "active": "1" },
  { "categoryId": "4", "categoryNumber": "400", "categoryName": "Haul Out Yard Services", "active": "1" },
  { "categoryId": "5", "categoryNumber": "500", "categoryName": "Fishing Guides and Fishing Charters", "active": "1" },
  { "categoryId": "6", "categoryNumber": "600", "categoryName": "Charter Vessel and/or Captain/Crew", "active": "1" },
  { "categoryId": "7", "categoryNumber": "700", "categoryName": "Transportation", "active": "1" },
  { "categoryId": "8", "categoryNumber": "800", "categoryName": "Personal Water Transportation", "active": "1" },
  { "categoryId": "11", "categoryNumber": "900", "categoryName": "Marine Sales", "active": "1" },
  { "categoryId": "14", "categoryNumber": "1000", "categoryName": "Insurance", "active": "1" },
  { "categoryId": "17", "categoryNumber": "1100", "categoryName": "Storage", "active": "1" },
  { "categoryId": "18", "categoryNumber": "1200", "categoryName": "Fishing Licenses and Training Courses", "active": "1" },
  { "categoryId": "19", "categoryNumber": "1300", "categoryName": "Financing", "active": "1" },
  { "categoryId": "20", "categoryNumber": "1400", "categoryName": "Surveyor, Inspections, Appraisal", "active": "1" },
  { "categoryId": "21", "categoryNumber": "1500", "categoryName": "Marine Personnel for Hire", "active": "1" },
  { "categoryId": "22", "categoryNumber": "1600", "categoryName": "Safety", "active": "1" },
  { "categoryId": "23", "categoryNumber": "1700", "categoryName": "Maps &  Charts", "active": "1" },
  { "categoryId": "24", "categoryNumber": "1800", "categoryName": "Government Offices - Federal and State", "active": "1" },
  { "categoryId": "25", "categoryNumber": "1900", "categoryName": "Custom Builds", "active": "1" },
  { "categoryId": "26", "categoryNumber": "2000", "categoryName": "Tow and Rescue", "active": "1" },
  { "categoryId": "27", "categoryNumber": "2100", "categoryName": "Water Sports", "active": "1" },
  { "categoryId": "28", "categoryNumber": "5000", "categoryName": "Other", "active": "1" },

  { "subCategoryId": "1", "categoryId": "1", "subCategoryNumber": "101", "subCategoryName": "Boat Ramps Open to Public", "active": "1" },
  { "subCategoryId": "2", "categoryId": "1", "subCategoryNumber": "102", "subCategoryName": "Private Boat Ramps", "active": "1" },
  { "subCategoryId": "3", "categoryId": "1", "subCategoryNumber": "103", "subCategoryName": "Bait and Tackle Services", "active": "1" },
  { "subCategoryId": "4", "categoryId": "1", "subCategoryNumber": "104", "subCategoryName": "Fueling Services", "active": "1" },
  { "subCategoryId": "5", "categoryId": "1", "subCategoryNumber": "105", "subCategoryName": "Ship Store/Supplies", "active": "1" },
  { "subCategoryId": "6", "categoryId": "2", "subCategoryNumber": "201", "subCategoryName": "Pontoon Boat Rentals", "active": "1" },
  { "subCategoryId": "7", "categoryId": "2", "subCategoryNumber": "202", "subCategoryName": "Kayak Rentals - Single and Tandem", "active": "1" },
  { "subCategoryId": "8", "categoryId": "2", "subCategoryNumber": "203", "subCategoryName": "Large Vessel, House Boats", "active": "1" },
  { "subCategoryId": "9", "categoryId": "3", "subCategoryNumber": "301", "subCategoryName": "Engine Repair/Mechanical", "active": "1" },
  { "subCategoryId": "10", "categoryId": "3", "subCategoryNumber": "302", "subCategoryName": "Outboard", "active": "1" },
  { "subCategoryId": "11", "categoryId": "3", "subCategoryNumber": "303", "subCategoryName": "Inboard/Outdrives", "active": "1" },
  { "subCategoryId": "12", "categoryId": "3", "subCategoryNumber": "304", "subCategoryName": "Gasoline Engines/Outdrives", "active": "1" },
  { "subCategoryId": "13", "categoryId": "3", "subCategoryNumber": "305", "subCategoryName": "Diesel Engines", "active": "1" },
  { "subCategoryId": "14", "categoryId": "3", "subCategoryNumber": "306", "subCategoryName": "Air-Conditioning", "active": "1" },
  { "subCategoryId": "15", "categoryId": "3", "subCategoryNumber": "307", "subCategoryName": "Electronics", "active": "1" },
  { "subCategoryId": "16", "categoryId": "3", "subCategoryNumber": "308", "subCategoryName": "Non-Structural Fiberglass Repair", "active": "1" },
  { "subCategoryId": "17", "categoryId": "3", "subCategoryNumber": "309", "subCategoryName": "Welding Repair", "active": "1" },
  { "subCategoryId": "18", "categoryId": "3", "subCategoryNumber": "310", "subCategoryName": "Paint Work", "active": "1" },
  { "subCategoryId": "19", "categoryId": "3", "subCategoryNumber": "311", "subCategoryName": "Teak and Trim", "active": "1" },
  { "subCategoryId": "20", "categoryId": "3", "subCategoryNumber": "312", "subCategoryName": "General Services", "active": "1" },
  { "subCategoryId": "21", "categoryId": "3", "subCategoryNumber": "313", "subCategoryName": "Boat and Vessel Cleaning\/Detailing", "active": "1" },
  { "subCategoryId": "22", "categoryId": "4", "subCategoryNumber": "401", "subCategoryName": "Medium to Large Vessel (20-60ft)", "active": "1" },
  { "subCategoryId": "23", "categoryId": "4", "subCategoryNumber": "402", "subCategoryName": "Large to Mega (60-120ft)", "active": "1" },
  { "subCategoryId": "24", "categoryId": "4", "subCategoryNumber": "403", "subCategoryName": "Large Vessels/Mega Yacht (120ft. Plus)", "active": "1" },
  { "subCategoryId": "25", "categoryId": "4", "subCategoryNumber": "404", "subCategoryName": "Ship Store Available", "active": "1" },
  { "subCategoryId": "26", "categoryId": "5", "subCategoryNumber": "501", "subCategoryName": "Salt Water Bay Fishing", "active": "1" },
  { "subCategoryId": "27", "categoryId": "5", "subCategoryNumber": "502", "subCategoryName": "Salt Water Offshore", "active": "1" },
  { "subCategoryId": "28", "categoryId": "5", "subCategoryNumber": "503", "subCategoryName": "Flounder Fishing", "active": "1" },
  { "subCategoryId": "29", "categoryId": "5", "subCategoryNumber": "504", "subCategoryName": "Duck Hunting/Birds", "active": "1" },
  { "subCategoryId": "30", "categoryId": "5", "subCategoryNumber": "505", "subCategoryName": "Flats Fishing", "active": "1" },
  { "subCategoryId": "31", "categoryId": "5", "subCategoryNumber": "506", "subCategoryName": "Fly Fishing", "active": "1" },
  { "subCategoryId": "32", "categoryId": "5", "subCategoryNumber": "507", "subCategoryName": "Kayak Fishing", "active": "1" },
  { "subCategoryId": "33", "categoryId": "5", "subCategoryNumber": "508", "subCategoryName": "Surf Fishing", "active": "1" },
  { "subCategoryId": "34", "categoryId": "5", "subCategoryNumber": "509", "subCategoryName": "Other Guide Services", "active": "1" },
  { "subCategoryId": "35", "categoryId": "6", "subCategoryNumber": "601", "subCategoryName": "Charter Vessel-Offshore", "active": "1" },
  { "subCategoryId": "36", "categoryId": "6", "subCategoryNumber": "602", "subCategoryName": "Charter Vessel-Inshore", "active": "1" },
  { "subCategoryId": "37", "categoryId": "6", "subCategoryNumber": "603", "subCategoryName": "Contract Crew-Capt.", "active": "1" },
  { "subCategoryId": "38", "categoryId": "6", "subCategoryNumber": "604", "subCategoryName": "Contract Crew-Fishing Mate", "active": "1" },
  { "subCategoryId": "39", "categoryId": "6", "subCategoryNumber": "605", "subCategoryName": "Contract Crew-Cleaning Mate", "active": "1" },
  { "subCategoryId": "40", "categoryId": "6", "subCategoryNumber": "606", "subCategoryName": "Contract Crew-Stew", "active": "1" },
  { "subCategoryId": "41", "categoryId": "7", "subCategoryNumber": "701", "subCategoryName": "Boat Taxi Service", "active": "1" },
  { "subCategoryId": "42", "categoryId": "7", "subCategoryNumber": "702", "subCategoryName": "Personal Service", "active": "1" },
  { "subCategoryId": "43", "categoryId": "7", "subCategoryNumber": "703", "subCategoryName": "By Land/With Trailer", "active": "1" },
  { "subCategoryId": "44", "categoryId": "7", "subCategoryNumber": "704", "subCategoryName": "By Land/Without Trailer", "active": "1" },
  { "subCategoryId": "45", "categoryId": "7", "subCategoryNumber": "705", "subCategoryName": "By Land/Semi Truck", "active": "1" },
  { "subCategoryId": "46", "categoryId": "7", "subCategoryNumber": "706", "subCategoryName": "By Water", "active": "1" },
  { "subCategoryId": "47", "categoryId": "8", "subCategoryNumber": "801", "subCategoryName": "Boat Taxi Service", "active": "1" },
  { "subCategoryId": "48", "categoryId": "8", "subCategoryNumber": "802", "subCategoryName": "Personal Transportation Service", "active": "1" },
  { "subCategoryId": "50", "categoryId": "11", "subCategoryNumber": "901", "subCategoryName": "Small Boats and Pontoons", "active": "1" },
  { "subCategoryId": "53", "categoryId": "11", "subCategoryNumber": "902", "subCategoryName": "Kayaks, Paddle Boards, Canoes", "active": "1" },
  { "subCategoryId": "61", "categoryId": "11", "subCategoryNumber": "903", "subCategoryName": "Large Vessel, House Boats", "active": "1" },
  { "subCategoryId": "63", "categoryId": "11", "subCategoryNumber": "904", "subCategoryName": "Yacht Broker", "active": "1" },
  { "subCategoryId": "64", "categoryId": "3", "subCategoryNumber": "314", "subCategoryName": "Canvas Work & Upholstery", "active": "1" },
  { "subCategoryId": "65", "categoryId": "11", "subCategoryNumber": "905", "subCategoryName": "Boat Sales - New", "active": "1" },
  { "subCategoryId": "66", "categoryId": "3", "subCategoryNumber": "315", "subCategoryName": "Yacht Maintenance/Repairs", "active": "1" },
  { "subCategoryId": "68", "categoryId": "2", "subCategoryNumber": "204 ", "subCategoryName": "Yacht Rentals", "active": "1" },
  { "subCategoryId": "69", "categoryId": "17", "subCategoryNumber": "1101", "subCategoryName": "Boat Storage", "active": "1" },
  { "subCategoryId": "70", "categoryId": "2", "subCategoryNumber": "205", "subCategoryName": "Jet Ski Rentals", "active": "1" },
  { "subCategoryId": "71", "categoryId": "2", "subCategoryNumber": "206", "subCategoryName": "Shade Rentals: Umbrellas, Canopies, Cabanas", "active": "1" },
  { "subCategoryId": "72", "categoryId": "18", "subCategoryNumber": "1201", "subCategoryName": "Medical Training", "active": "1" },
  { "subCategoryId": "73", "categoryId": "5", "subCategoryNumber": "510", "subCategoryName": "Tours and Cruises", "active": "1" },
  { "subCategoryId": "74", "categoryId": "19", "subCategoryNumber": "1302", "subCategoryName": "Boat Financing", "active": "1" },
  { "subCategoryId": "75", "categoryId": "19", "subCategoryNumber": "1301", "subCategoryName": "Yacht Financing", "active": "1" },
  { "subCategoryId": "76", "categoryId": "20", "subCategoryNumber": "1401", "subCategoryName": "Surveyor", "active": "1" },
  { "subCategoryId": "77", "categoryId": "20", "subCategoryNumber": "1402", "subCategoryName": "Inspections", "active": "1" },
  { "subCategoryId": "78", "categoryId": "20", "subCategoryNumber": "1403", "subCategoryName": "Appraisal", "active": "1" },
  { "subCategoryId": "79", "categoryId": "18", "subCategoryNumber": "1202", "subCategoryName": "Boat Sailing Instruction", "active": "1" },
  { "subCategoryId": "80", "categoryId": "11", "subCategoryNumber": "906", "subCategoryName": "Trailers", "active": "1" },
  { "subCategoryId": "81", "categoryId": "2", "subCategoryNumber": "207", "subCategoryName": "Surfboard Rentals", "active": "1" },
  { "subCategoryId": "82", "categoryId": "11", "subCategoryNumber": "907", "subCategoryName": "Surfboards", "active": "1" },
  { "subCategoryId": "83", "categoryId": "3", "subCategoryNumber": "316", "subCategoryName": "Trailer Service/Repair", "active": "1" },
  { "subCategoryId": "84", "categoryId": "11", "subCategoryNumber": "908", "subCategoryName": "Boat Broker", "active": "1" },
  { "subCategoryId": "85", "categoryId": "3", "subCategoryNumber": "317", "subCategoryName": "Window Tint", "active": "1" },
  { "subCategoryId": "89", "categoryId": "21", "subCategoryNumber": "1504", "subCategoryName": "Chef/Other Culinary", "active": "1" },
  { "subCategoryId": "90", "categoryId": "21", "subCategoryNumber": "1502", "subCategoryName": "Mates/Deckhands", "active": "1" },
  { "subCategoryId": "91", "categoryId": "21", "subCategoryNumber": "1503", "subCategoryName": "Steward", "active": "1" },
  { "subCategoryId": "92", "categoryId": "21", "subCategoryNumber": "1501", "subCategoryName": "Captain", "active": "1" },
  { "subCategoryId": "93", "categoryId": "3", "subCategoryNumber": "318", "subCategoryName": "Custom Boat and Yacht Shirts", "active": "1" },
  { "subCategoryId": "94", "categoryId": "5", "subCategoryNumber": "511", "subCategoryName": "Fish Taxidermy", "active": "1" },
  { "subCategoryId": "95", "categoryId": "3", "subCategoryNumber": "319", "subCategoryName": "Ceramic Coating", "active": "1" },
  { "subCategoryId": "96", "categoryId": "18", "subCategoryNumber": "1204", "subCategoryName": "Captain's License School and Assistance", "active": "1" },
  { "subCategoryId": "97", "categoryId": "18", "subCategoryNumber": "1203", "subCategoryName": "Scuba Diving Lessons", "active": "1" },
  { "subCategoryId": "98", "categoryId": "5", "subCategoryNumber": "512", "subCategoryName": "Tours: Dive & Snorkel", "active": "1" },
  { "subCategoryId": "99", "categoryId": "3", "subCategoryNumber": "320", "subCategoryName": "Dive Services", "active": "1" },
  { "subCategoryId": "100", "categoryId": "1", "subCategoryNumber": "106", "subCategoryName": "Full Service Marina", "active": "1" },
  { "subCategoryId": "101", "categoryId": "2", "subCategoryNumber": "208", "subCategoryName": "Other beach/water equipment", "active": "1" },
  { "subCategoryId": "102", "categoryId": "2", "subCategoryNumber": "209", "subCategoryName": "Flyboard Rentals", "active": "1" },
  { "subCategoryId": "103", "categoryId": "2", "subCategoryNumber": "210", "subCategoryName": "Parasail, Banana Boat Rentals", "active": "1" },
  { "subCategoryId": "104", "categoryId": "5", "subCategoryNumber": "513", "subCategoryName": "Freshwater Fishing", "active": "1" },
  { "subCategoryId": "105", "categoryId": "22", "subCategoryNumber": "1601", "subCategoryName": "Fire Extinguishers and Halon System", "active": "1" },
  { "subCategoryId": "106", "categoryId": "22", "subCategoryNumber": "1602", "subCategoryName": "First-Aid Medical Kits", "active": "1" },
  { "subCategoryId": "107", "categoryId": "22", "subCategoryNumber": "1603", "subCategoryName": "Safety Training", "active": "1" },
  { "subCategoryId": "108", "categoryId": "3", "subCategoryNumber": "321", "subCategoryName": "Crane Services", "active": "1" },
  { "subCategoryId": "109", "categoryId": "2", "subCategoryNumber": "211", "subCategoryName": "Boat Club", "active": "1" },
  { "subCategoryId": "110", "categoryId": "3", "subCategoryNumber": "322", "subCategoryName": "Propeller Removal/Installation", "active": "1" },
  { "subCategoryId": "111", "categoryId": "11", "subCategoryNumber": "909", "subCategoryName": "Equipment and Supplies", "active": "1" },
  { "subCategoryId": "112", "categoryId": "2", "subCategoryNumber": "212", "subCategoryName": "Yacht Club", "active": "1" },
  { "subCategoryId": "113", "categoryId": "3", "subCategoryNumber": "323 ", "subCategoryName": "Plumbing", "active": "1" },
  { "subCategoryId": "114", "categoryId": "3", "subCategoryNumber": "324", "subCategoryName": "Winterization", "active": "1" },
  { "subCategoryId": "115", "categoryId": "3", "subCategoryNumber": "325", "subCategoryName": "Custom Boat/Yacht Building", "active": "1" },
  { "subCategoryId": "116", "categoryId": "3", "subCategoryNumber": "326", "subCategoryName": "Boat Names/Graphics", "active": "1" },
  { "subCategoryId": "118", "categoryId": "3", "subCategoryNumber": "327", "subCategoryName": "Memorial Services at Sea", "active": "1" },
  { "subCategoryId": "119", "categoryId": "18", "subCategoryNumber": "1205", "subCategoryName": "Surfing Instruction", "active": "1" },
  { "subCategoryId": "120", "categoryId": "3", "subCategoryNumber": "329", "subCategoryName": "Marine Interiors", "active": "1" },
  { "subCategoryId": "121", "categoryId": "3", "subCategoryNumber": "328", "subCategoryName": "Wedding/Celebratory Events at Sea", "active": "1" },
  { "subCategoryId": "122", "categoryId": "14", "subCategoryNumber": "1001", "subCategoryName": "Insurance", "active": "1" },
  { "subCategoryId": "123", "categoryId": "1", "subCategoryNumber": "107", "subCategoryName": "Marina Management", "active": "1" },
  { "subCategoryId": "124", "categoryId": "3", "subCategoryNumber": "329", "subCategoryName": "Jet Ski Repair", "active": "1" },
  { "subCategoryId": "125", "categoryId": "18", "subCategoryNumber": "1206", "subCategoryName": "Kiteboarding Instruction", "active": "1" },
  { "subCategoryId": "126", "categoryId": "5", "subCategoryNumber": "514", "subCategoryName": "Trout Fishing", "active": "1" },
  { "subCategoryId": "127", "categoryId": "5", "subCategoryNumber": "515", "subCategoryName": "Redfish Fishing", "active": "1" },
  { "subCategoryId": "128", "categoryId": "5", "subCategoryNumber": "516", "subCategoryName": "Drum Fishing", "active": "1" },
  { "subCategoryId": "129", "categoryId": "18", "subCategoryNumber": "1207", "subCategoryName": "Fishing License", "active": "1" },
  { "subCategoryId": "130", "categoryId": "1", "subCategoryNumber": "108", "subCategoryName": "Boat Slips", "active": "1" },
  { "subCategoryId": "131", "categoryId": "1", "subCategoryNumber": "109", "subCategoryName": "Dockage", "active": "1" },
  { "subCategoryId": "132", "categoryId": "5", "subCategoryNumber": "510", "subCategoryName": "Dolphin Watching", "active": "1" },
  { "subCategoryId": "133", "categoryId": "2", "subCategoryNumber": "213", "subCategoryName": "Boat Rentals", "active": "1" },
  { "subCategoryId": "134", "categoryId": "2", "subCategoryNumber": "214", "subCategoryName": "Yacht charters", "active": "1" },
  { "subCategoryId": "135", "categoryId": "11", "subCategoryNumber": "910", "subCategoryName": "Fishing Rods", "active": "1" },
  { "subCategoryId": "136", "categoryId": "11", "subCategoryNumber": "911", "subCategoryName": "Fishing Lures", "active": "1" },
  { "subCategoryId": "137", "categoryId": "11", "subCategoryNumber": "912", "subCategoryName": "Fishing Camera", "active": "1" },
  { "subCategoryId": "138", "categoryId": "11", "subCategoryNumber": "913", "subCategoryName": "Wade Gear", "active": "1" },
  { "subCategoryId": "139", "categoryId": "5", "subCategoryNumber": "512", "subCategoryName": "Halibut Fishing", "active": "1" },
  { "subCategoryId": "140", "categoryId": "5", "subCategoryNumber": "511", "subCategoryName": "Salmon Fishing", "active": "1" },
  { "subCategoryId": "141", "categoryId": "5", "subCategoryNumber": "513", "subCategoryName": "Catfish Fishing", "active": "1" },
  { "subCategoryId": "142", "categoryId": "2", "subCategoryNumber": "215", "subCategoryName": "Fishing Club", "active": "1" },
  { "subCategoryId": "143", "categoryId": "5", "subCategoryNumber": "514", "subCategoryName": "Bass Fishing", "active": "1" },
  { "subCategoryId": "144", "categoryId": "18", "subCategoryNumber": "1208", "subCategoryName": "Wakeboarding Lessons", "active": "1" },
  { "subCategoryId": "145", "categoryId": "18", "subCategoryNumber": "1209", "subCategoryName": "SUP Lessons", "active": "1" },
  { "subCategoryId": "146", "categoryId": "2", "subCategoryNumber": "216", "subCategoryName": "Flyboarding/Water Jet Pack", "active": "1" },
  { "subCategoryId": "147", "categoryId": "18", "subCategoryNumber": "1210", "subCategoryName": "Scuba Diving Lessons", "active": "1" },
  { "subCategoryId": "148", "categoryId": "5", "subCategoryNumber": "515", "subCategoryName": "Wakeboarding, Waterskiing, and Tubing, Kneeboarding", "active": "1" },
  { "subCategoryId": "149", "categoryId": "2", "subCategoryNumber": "217", "subCategoryName": "Water Tube Rentals", "active": "1" },
  { "subCategoryId": "150", "categoryId": "18", "subCategoryNumber": "1212", "subCategoryName": "Kayak Lessons", "active": "1" },
  { "subCategoryId": "151", "categoryId": "18", "subCategoryNumber": "1211", "subCategoryName": "Canoe Lessons", "active": "1" },
  { "subCategoryId": "152", "categoryId": "2", "subCategoryNumber": "218", "subCategoryName": "Tritoon Rentals", "active": "1" },
  { "subCategoryId": "153", "categoryId": "2", "subCategoryNumber": "219", "subCategoryName": "Deck Boat Rentals", "active": "1" },
  { "subCategoryId": "154", "categoryId": "3", "subCategoryNumber": "330", "subCategoryName": "Propeller Repair", "active": "1" },
  { "subCategoryId": "155", "categoryId": "11", "subCategoryNumber": "914", "subCategoryName": "Propellers New/Used", "active": "1" },
  { "subCategoryId": "156", "categoryId": "3", "subCategoryNumber": "331", "subCategoryName": "AC/DC Electrical", "active": "1" },
  { "subCategoryId": "158", "categoryId": "11", "subCategoryNumber": "915", "subCategoryName": "Yacht Sales", "active": "1" },
  { "subCategoryId": "159", "categoryId": "3", "subCategoryNumber": "332", "subCategoryName": "Marine Refrigeration/Freezer Systems", "active": "1" },
  { "subCategoryId": "160", "categoryId": "23", "subCategoryNumber": "1701", "subCategoryName": "Maps & Charts", "active": "1" },
  { "subCategoryId": "161", "categoryId": "20", "subCategoryNumber": "1404", "subCategoryName": "Surveyor - Mechanical", "active": "1" },
  { "subCategoryId": "162", "categoryId": "20", "subCategoryNumber": "1405", "subCategoryName": "Surveyor - Hull", "active": "1" },
  { "subCategoryId": "163", "categoryId": "3", "subCategoryNumber": "333 ", "subCategoryName": "Outriggers/Rigging Services", "active": "1" },
  { "subCategoryId": "164", "categoryId": "24", "subCategoryNumber": "1801", "subCategoryName": "Hunting and Fishing Licences", "active": "1" },
  { "subCategoryId": "165", "categoryId": "24", "subCategoryNumber": "1802", "subCategoryName": "Boat Registration", "active": "1" },
  { "subCategoryId": "166", "categoryId": "24", "subCategoryNumber": "1803", "subCategoryName": "United States Coast Guard", "active": "1" },
  { "subCategoryId": "167", "categoryId": "25", "subCategoryNumber": "1901", "subCategoryName": "Custom built Canoes and Kayaks", "active": "1" },
  { "subCategoryId": "168", "categoryId": "18", "subCategoryNumber": "1213", "subCategoryName": "Boat Operation/Instruction", "active": "1" },
  { "subCategoryId": "169", "categoryId": "2", "subCategoryNumber": "221", "subCategoryName": "Canoe Rentals", "active": "1" },
  { "subCategoryId": "170", "categoryId": "2", "subCategoryNumber": "220", "subCategoryName": "Paddleboard Rentals", "active": "1" },
  { "subCategoryId": "171", "categoryId": "26", "subCategoryNumber": "2001", "subCategoryName": "Emergency Towing", "active": "1" },
  { "subCategoryId": "172", "categoryId": "26", "subCategoryNumber": "2002", "subCategoryName": "Groundings", "active": "1" },
  { "subCategoryId": "173", "categoryId": "7", "subCategoryNumber": "707", "subCategoryName": "Tow Boat Services", "active": "1" },
  { "subCategoryId": "174", "categoryId": "3", "subCategoryNumber": "334", "subCategoryName": "Structural Fiberglass Repair", "active": "1" },
  { "subCategoryId": "175", "categoryId": "3", "subCategoryNumber": "336", "subCategoryName": "Gelcoat Repair", "active": "1" },
  { "subCategoryId": "176", "categoryId": "3", "subCategoryNumber": "335", "subCategoryName": "Complete Restoration", "active": "1" },
  { "subCategoryId": "177", "categoryId": "3", "subCategoryNumber": "337", "subCategoryName": "Bottom Paint", "active": "1" },
  { "subCategoryId": "178", "categoryId": "27", "subCategoryNumber": "2107", "subCategoryName": "Windsurfing", "active": "1" },
  { "subCategoryId": "181", "categoryId": "27", "subCategoryNumber": "2106", "subCategoryName": "Water Skiing", "active": "1" },
  { "subCategoryId": "182", "categoryId": "27", "subCategoryNumber": "2104", "subCategoryName": "Wakeboarding", "active": "1" },
  { "subCategoryId": "183", "categoryId": "27", "subCategoryNumber": "2110", "subCategoryName": "Surfing", "active": "1" },
  { "subCategoryId": "184", "categoryId": "27", "subCategoryNumber": "2109", "subCategoryName": "Parasailing", "active": "1" },
  { "subCategoryId": "187", "categoryId": "27", "subCategoryNumber": "2114", "subCategoryName": "Sailing", "active": "1" },
  { "subCategoryId": "188", "categoryId": "27", "subCategoryNumber": "2101", "subCategoryName": "White Water Raft, Kayak Outfitters", "active": "1" },
  { "subCategoryId": "189", "categoryId": "27", "subCategoryNumber": "2108", "subCategoryName": "Kitesurfing", "active": "1" },
  { "subCategoryId": "193", "categoryId": "3", "subCategoryNumber": "338", "subCategoryName": "Boat Enclosures", "active": "1" },
  { "subCategoryId": "194", "categoryId": "2", "subCategoryNumber": "221", "subCategoryName": "Boat Powered Tubing", "active": "1" },
  { "subCategoryId": "195", "categoryId": "5", "subCategoryNumber": "516", "subCategoryName": "Fish Camp/Lodge", "active": "1" },
  { "subCategoryId": "196", "categoryId": "5", "subCategoryNumber": "517", "subCategoryName": "Fishing Charters and Fishing Guides", "active": "1" },
  { "subCategoryId": "197", "categoryId": "11", "subCategoryNumber": "916", "subCategoryName": "Boat Sales - Used", "active": "1" },
  { "subCategoryId": "198", "categoryId": "11", "subCategoryNumber": "917", "subCategoryName": "Scuba Diving Equipment", "active": "1" },
  { "subCategoryId": "199", "categoryId": "27", "subCategoryNumber": "2109", "subCategoryName": "Scuba Diving", "active": "1" },
  { "subCategoryId": "200", "categoryId": "5", "subCategoryNumber": "518", "subCategoryName": "Inshore Fishing", "active": "1" },
  { "subCategoryId": "201", "categoryId": "3", "subCategoryNumber": "339", "subCategoryName": "Marine Audio", "active": "1" },
  { "subCategoryId": "202", "categoryId": "3", "subCategoryNumber": "340", "subCategoryName": "Marine Lighting", "active": "1" },
  { "subCategoryId": "500", "categoryId": "28", "subCategoryNumber": "5000", "subCategoryName": "Various Services", "active": "1" }
]
